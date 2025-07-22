import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';

@Injectable()
export class LessonsService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll() {
        const lessons = await this.prisma.lesson.findMany()
        return responseMessage("", lessons)
    }

    async getSingle(id: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id }
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
