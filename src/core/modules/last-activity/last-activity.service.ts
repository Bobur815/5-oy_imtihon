import { Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLastActivityDto, UpdateLastActivityDto } from './dto/last-activitydto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class LastActivityService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(user: RequestWithUser['user']) {
        let where: Prisma.LastActivityWhereInput = {}
        if (user.role !== Role.ADMIN) {
            where = { id: user.id }
        }

        const lastActivities = await this.prisma.lastActivity.findMany({
            include: {
                user: true,
                course: true,
                lesson: true,
                module: true
            }, 
            where
        });
        
        return responseMessage("", lastActivities)
    }

    async create(data: CreateLastActivityDto) {
        const user = await this.prisma.user.findUnique({ where: { id: data.userId } })
        const course = await this.prisma.course.findUnique({ where: { id: data.courseId } })
        const lesson = await this.prisma.lesson.findUnique({ where: { id: data.lessonId } })
        const module = await this.prisma.lessonModule.findUnique({ where: { id: data.moduleId } })

        if (!user) throw new NotFoundException('User not found');
        if (!course) throw new NotFoundException('Course not found');
        if (!lesson) throw new NotFoundException('Lesson not found');
        if (!module) throw new NotFoundException('Module not found');

        const newActivity = await this.prisma.lastActivity.create({ data });

        return responseMessage("New activity saved", newActivity)
    }

    async update(id: number, data: UpdateLastActivityDto) {
        const existing = await this.prisma.lastActivity.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException(`LastActivity with ID ${id} not found`);
        const updated = await this.prisma.lastActivity.update({
            where: { id },
            data,
        });

        return responseMessage("Activity updated", updated)
    }

    async delete(id: number) {
        const existing = await this.prisma.lastActivity.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException(`LastActivity with ID ${id} not found`);
        await this.prisma.lastActivity.delete({ where: { id } });
        return responseMessage('Last activity deleted')
    }
}
