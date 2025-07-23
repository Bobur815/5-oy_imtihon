import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(user: RequestWithUser['user']) {
        let where: Prisma.LessonWhereInput = {}
        // Studentlar uchun faqat sotib olgan lessonning video fayli ko'rinadi
        if (user.role === Role.STUDENT) {
            where.module!.course!.purchasedCourse = { some: { userId: user.id } }
        }
        const lessons = await this.prisma.lesson.findMany({
            include: {
                lessonFile: true
            }, where
        })
        return responseMessage("", lessons)
    }

    async getSingle(user: RequestWithUser['user'], id: string) {
        let where: Prisma.LessonWhereInput = { id }
        // Studentlar uchun faqat sotib olgan lessonning video fayli ko'rinadi
        if (user.role === Role.STUDENT) {
            where.module!.course!.purchasedCourse = { some: { userId: user.id } }
        }
        const lesson = await this.prisma.lesson.findFirst({
            include:{
                lessonFile:true
            },
            where
        })
        if (!lesson) throw new NotFoundException(`Lesson with ID ${id} not found`)

        return responseMessage("", lesson)
    }

    async create(payload: CreateLessonDto, video_url: string) {
        payload.moduleId = Number(payload.moduleId)
        const moduleExists = await this.prisma.lessonModule.findUnique({
            where: { id: payload.moduleId }
        })
        if (!moduleExists) {
            throw new NotFoundException(`Lesson module with ID ${payload.moduleId} not found`)
        }

        const existing = await this.prisma.lesson.findFirst({
            where: {
                name: payload.name,
                moduleId: payload.moduleId
            }
        })
        if (existing) {
            throw new ConflictException(`Lesson with name ${payload.name} already exists in this module`)
        }

        if (!video_url) {
            throw new BadRequestException("Video of the lesson not found")
        }

        const newLesson = await this.prisma.lesson.create({
            data: {
                ...payload,
                video_url
            }
        })
        return responseMessage("New lesson successfully created", newLesson)
    }

    async update(id: string, payload: UpdateLessonDto, video_url?: string) {
        const existing = await this.prisma.lesson.findUnique({
            where: { id }
        })
        if (!existing) throw new NotFoundException(`Lesson with ID ${id} not found`)

        if (video_url && existing.video_url) {
            removeOldAvatar('lesson', existing.video_url)
            payload['video_url'] = video_url
        }

        const updated = await this.prisma.lesson.update({
            data: { ...payload },
            where: { id }
        })

        return responseMessage("Lesson successfully updated", updated)
    }

    async delete(id: string) {
        const existing = await this.prisma.lesson.findUnique({
            where: { id }
        })
        if (!existing) throw new NotFoundException(`Lesson with ID ${id} not found`)

        await this.prisma.lesson.delete({
            where: { id }
        })
        return responseMessage("Lesson deleted")
    }
}
