import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    
    async getAllUsers() {
        const users = await this.prisma.user.findMany()
        return users
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

        return user
    }

    async updateUser(user_id: number, payload: UpdateProfileDto, image_url: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id }
        })
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`)
        }

        if (image_url && user.image_url) {
            removeOldAvatar('user',user.image_url);
        }

        if (user.role === 'STUDENT') {

            const updatedData = await this.prisma.user.update({
                where: { id: user_id },
                data: {
                    ...payload,
                    image_url: image_url ?? null
                }
            })

            return {
                success: true,
                message: 'Student profile successfully updated',
                data: updatedData
            }
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

        return {
            success: true,
            message: `${user.role} profile successfully updated`,
            data: newMentorProfile,
        };
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

        return 'User successfully deleted'
    }
}
