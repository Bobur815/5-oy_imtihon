// src/lesson-module/lesson-module.service.ts

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonModuleDto, UpdateLessonModuleDto } from './dto/dto';

@Injectable()
export class LessonModuleService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll() {
        const modules = await this.prisma.lessonModule.findMany({
            include: {
                course: { select: { name: true } }
            }
        });
        return responseMessage("", modules)
    }

    async getSingle(id: number) {
        const module = await this.prisma.lessonModule.findUnique({
            where: { id },
            include: {
                course: { select: { name: true } }
            }
        })
        if(!module) throw new NotFoundException(`Lesson module with ID ${ id } not found`)
        return responseMessage("",module)
    }

    async create(payload: CreateLessonModuleDto) {
        const course = await this.prisma.course.findUnique({
            where: { id: payload.courseId }
        })

        if (!course) {
            throw new NotFoundException(`Course with id ${payload.courseId} not found`)
        }

        const existing = await this.prisma.lessonModule.findFirst({
            where: {
                title: payload.title,
                courseId: payload.courseId
            }
        })
        if (existing) {
            throw new ConflictException(`Module with title ${payload.title} exists in this course`)
        }


        const newModule = await this.prisma.lessonModule.create({
            data: {
                title: payload.title,
                order: payload.order,
                courseId: payload.courseId,
            },
        });

        return responseMessage("New lesson-module created", newModule)
    }

    async update(id: number, payload: UpdateLessonModuleDto) {
        const existing = await this.prisma.lessonModule.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`LessonModule with id ${id} not found`);
        }

        const updated = await this.prisma.lessonModule.update({
            where: { id },
            data: {
                title: payload.title,
                order: payload.order,
                courseId: payload.courseId,
            },
        });

        return responseMessage("Lesson Module updated", updated)
    }

    async delete(id: number) {
        const existing = await this.prisma.lessonModule.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`LessonModule with id ${id} not found`);
        }

        await this.prisma.lessonModule.delete({ where: { id } });
        return responseMessage("Lesson module deleted")
    }
}
