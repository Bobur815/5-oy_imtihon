import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { HomeworkSubmissionDto, UpdateHomeworkSubmissionDto } from './dto/dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Prisma, Role, User } from '@prisma/client';

@Injectable()
export class HomeworkSubmissionService {
    constructor(private readonly prisma: PrismaService) { }

    private buildSubmissionWhere(user: RequestWithUser['user'], id?: number): Prisma.HomeworkSubmissionWhereInput {
        const where: Prisma.HomeworkSubmissionWhereInput = {
            ...(id && { id }),
            homework: {
                lesson: {
                    module: {
                        course: {}
                    }
                }
            }
        };
        if (user.role === Role.STUDENT) {
            where.homework!.lesson!.module!.course = {
                purchasedCourse: { some: { userId: user.id } }
            };
        } else if (user.role === Role.MENTOR || user.role === Role.ASSISTANT) {
            where.homework!.lesson!.module!.course = {
                assignedCourse: { some: { userId: user.id } }
            };
        }
        return where;
    }

    async getAll(user: RequestWithUser['user']) {
        const where = this.buildSubmissionWhere(user);
        const all = await this.prisma.homeworkSubmission.findMany({
            where, include: {
                user: true,
                homework: true
            }
        });
        return responseMessage("", all);
    }

    async getSingle(user: RequestWithUser['user'], id: number) {
        const where = this.buildSubmissionWhere(user, id);
        const submission = await this.prisma.homeworkSubmission.findFirst({
            where, include: {
                user: true,
                homework: true
            }
        });
        if (!submission) throw new NotFoundException(`HomeworkSubmission not found`);
        return responseMessage('',submission);
    }

    async create(user: RequestWithUser['user'], payload: HomeworkSubmissionDto, filename: string) {
        payload.homeworkId = Number(payload.homeworkId)
        const currentUser = await this.prisma.user.findUnique({ where: { id: user.id } })
        const homework = await this.prisma.homework.findUnique({ where: { id: payload.homeworkId } })

        if (!currentUser) throw new NotFoundException("User not found")
        if (!homework) throw new NotFoundException("Homework not found")

        const exists = await this.prisma.homeworkSubmission.findFirst({
            where: {
                userId: user.id,
                homeworkId: payload.homeworkId
            }
        })
        if (exists) {
            throw new ConflictException(`User with ID ${user.id} already submitted to this homework`)
        }

        if (!filename) throw new NotFoundException("File is required")


        const newSubmission = await this.prisma.homeworkSubmission.create({
            data: {
                ...payload,
                file_url: filename,
                userId: user.id
            }
        })
        return responseMessage("Homework Submission saved", newSubmission)
    }

    async update(user: RequestWithUser['user'], id: number, payload: UpdateHomeworkSubmissionDto, filename?: string) {
        const homeworkSubmission = await this.getSingle(user, id)

        if (payload.homeworkId) {
            const homework = await this.prisma.homework.findUnique({ where: { id: payload.homeworkId } })
            if (!homework) throw new NotFoundException("Homework not found")
        }

        const data: Prisma.HomeworkSubmissionUpdateInput = { ...payload };
        if (filename && homeworkSubmission.data?.file_url) {
            data.file_url = filename
            removeOldAvatar('homeworkSubmission', homeworkSubmission.data.file_url)
        }

        const updated = await this.prisma.homeworkSubmission.update({
            data,
            where: { id }
        })

        return responseMessage("HomeworkSubmission updated", updated)
    }

    async delete(user: RequestWithUser['user'], id: number) {
        await this.getSingle(user, id)
        await this.prisma.homeworkSubmission.delete({ where: { id } })
        return responseMessage("Homework Submission deleted")
    }
}
