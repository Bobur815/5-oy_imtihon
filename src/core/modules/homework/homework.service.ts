import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeWorkDto, UpdateHomeWorkDto } from './dto/dto';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class HomeworkService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly lessonService: LessonsService
    ) { }

    async getAll(user: RequestWithUser['user']) {
        const where: Prisma.HomeworkWhereInput = {
            lesson: {
                module: {
                    course: {}
                }
            }
        };

        if (user.role === Role.STUDENT) {
            where.lesson!.module!.course = {
                purchasedCourse: { some: { userId: user.id } }
            };
        }
        else if (user.role === Role.ASSISTANT || user.role === Role.MENTOR) {
            where.lesson!.module!.course = {
                assignedCourse: { some: { userId: user.id } }
            };
        }

        const homeworks = await this.prisma.homework.findMany({
            where,
            include: { lesson: true }
        });

        return responseMessage("", homeworks);
    }


    async getSingle(id: number, user: RequestWithUser['user']) {
        const where: Prisma.HomeworkWhereInput = {
            id,
            lesson: {
                module: {
                    course: {}
                }
            }
        };

        if (user.role === Role.STUDENT) {
            where.lesson!.module!.course = {
                purchasedCourse: { some: { userId: user.id } }
            };
        }
        else if (user.role === Role.ASSISTANT || user.role === Role.MENTOR) {
            where.lesson!.module!.course = {
                assignedCourse: { some: { userId: user.id } }
            };
        }

        const homework = await this.prisma.homework.findFirst({
            where,
            include: { lesson: true }
        });

        if (!homework) {
            throw new NotFoundException(`Homework with ID ${id} not found`);
        }

        return responseMessage("", homework);
    }


    async create(payload: CreateHomeWorkDto, user: RequestWithUser['user'], filename?: string) {
        const homework = await this.prisma.homework.findFirst({
            where: { lessonId: payload.lessonId }
        })
        if (homework) throw new ConflictException("Homework already created to this Lesson")

        await this.lessonService.getSingle(user, payload.lessonId)
        if (filename) {
            payload['file'] = filename
        }
        const newHomework = await this.prisma.homework.create({ data: payload });
        return responseMessage("New Homework created", newHomework)
    }

    async update(id: number, payload: UpdateHomeWorkDto, user: RequestWithUser['user'], filename?: string ) {
        const exists = await this.prisma.homework.findUnique({ where: { id } });
        if (!exists) {
            throw new NotFoundException(`Homework with ID ${id} not found`);
        }
        if (payload.lessonId) {
            await this.lessonService.getSingle(user,payload.lessonId)
        }

        if (filename && exists.file) {
            console.log(exists.file);

            removeOldAvatar('homework', exists.file)
        }

        const updated = await this.prisma.homework.update({
            where: { id },
            data: {
                ...payload,
                file: filename
            },
        });
        return responseMessage("Homework updated", updated)
    }

    async delete(id: number, user: RequestWithUser['user']) {
        await this.getSingle(id, user)
        await this.prisma.homework.delete({ where: { id } });
        return responseMessage("Homework deleted");
    }
}
