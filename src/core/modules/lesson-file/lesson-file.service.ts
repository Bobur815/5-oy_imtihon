import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonFileDto, UpdateLessonFileDto } from './dto/dto';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { RequestWithUser } from 'src/common/types/request-with-user';

@Injectable()
export class LessonFileService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll() {
        const lessonFiles = await this.prisma.lessonFile.findMany({
            include: { lesson: true },
        });
        return responseMessage("", lessonFiles)
    }

    async create(data: CreateLessonFileDto, filename:string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: data.lessonId },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if(!filename){
            throw new BadRequestException("Filename for lesson is required")
        }

        const newFile = await this.prisma.lessonFile.create({
            data: {
                file_url:filename,
                note: data.note,
                lessonId: data.lessonId,
            },
        });

        return responseMessage('New lesson file saved', newFile);
    }

    async update(id: number, data: UpdateLessonFileDto, filename?:string) {
        const existing = await this.prisma.lessonFile.findUnique({
            where: { id },
        });
        if (!existing)
            throw new NotFoundException(`LessonFile with ID ${id} not found`);

        if (data.lessonId) {
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: data.lessonId },
            });
            if (!lesson) throw new NotFoundException('Lesson not found');
        }

        if(filename && existing.file_url){
            removeOldAvatar('lesson-files', existing.file_url)
            data['file_url'] = filename
        }

        const updated = await this.prisma.lessonFile.update({
            where: { id },
            data:{...data}
        });

        return responseMessage('Lesson file updated', updated);
    }

    async delete(id: number) {
        const existing = await this.prisma.lessonFile.findUnique({
            where: { id },
        });
        if (!existing)
            throw new NotFoundException(`LessonFile with ID ${id} not found`);

        await this.prisma.lessonFile.delete({ where: { id } });
        return responseMessage('Lesson file deleted');
    }
}
