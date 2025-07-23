import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { UserFilterDto } from './dto/users-filter.dto';
import { Prisma, Role } from '@prisma/client';
import { responseMessage } from 'src/common/utils/response.message';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }


    async getAllUsers(user: RequestWithUser['user'], filters: UserFilterDto) {
        const where: Prisma.UserWhereInput = {};

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.fullName) {
            where.fullName = {
                contains: filters.fullName,
                mode: 'insensitive',
            };
        }

        if ((user.role === Role.ASSISTANT || user.role === Role.MENTOR) && typeof filters.experience === 'number') {
            where.mentorProfile = {
                some: {
                    experience: { gte: filters.experience },
                },
            };
        }

        const select: Prisma.UserSelect = {
            id: true,
            fullName: true,
            phone: true,
            role: true,
            image_url: true,
            ...(user.role === Role.ASSISTANT || user.role === Role.MENTOR
                ? {
                    mentorProfile: {
                        select: {
                            experience: true,
                            about: true,
                            job: true,
                        },
                    },
                }
                : {}),
        };

        const users = await this.prisma.user.findMany({
            where,
            select,
        });

        return responseMessage('',users)
    }

    async getSingle(user_id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id },
            select: {
                id: true,
                fullName: true,
                image_url: true,
                role: true,
                phone: true,
                createdAt: true
            },
        })
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`)
        }
        if(user.role === Role.ASSISTANT || user.role === Role.MENTOR){
            user['mentorProfile'] = await this.prisma.mentorProfile.findFirst({
                where:{userId:user.id}
            })
        }

        return responseMessage('',user)
    }

    async updateUser(user_id: number, payload: UpdateProfileDto, image_url: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`)
        }

        if (image_url && user.image_url) {
            removeOldAvatar('user', user.image_url);
        }

        if (user.role === 'STUDENT') {

            const updatedData = await this.prisma.user.update({
                where: { id: user_id },
                data: {
                    ...payload,
                    image_url: image_url ?? null
                }
            })

            return responseMessage('Student profile successfully updated',updatedData)
        }

        if (image_url) {
            await this.prisma.user.update({
                where: { id: user_id },
                data: { image_url }
            })
        }

        let newMentorProfile;

        const existing = await this.prisma.mentorProfile.findUnique({
            where: { userId: user_id },
        });

        if (existing) {
            newMentorProfile = await this.prisma.mentorProfile.update({
                where: { userId: user_id },
                data: { ...payload },
            });
        } else {
            newMentorProfile = await this.prisma.mentorProfile.create({
                data: {
                    about: payload.about ?? null,
                    job: payload.job ?? null,
                    experience: payload.experience ?? 0,
                    telegram: payload.telegram ?? null,
                    instagram: payload.instagram ?? null,
                    linkedin: payload.linkedin ?? null,
                    facebook: payload.facebook ?? null,
                    github: payload.github ?? null,
                    website: payload.website ?? null,
                    userId: user_id,
                },
            });
        }

        return responseMessage(`${user.role} profile successfully updated`,newMentorProfile)
    }

    async deleteUser(user_id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`)
        }

        await this.prisma.user.delete({
            where: { id: user_id }
        })

        return responseMessage('User successfully deleted')
    }
}
