import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/dto';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourseService } from '../course/course.service';
import { UsersService } from '../users/users.service';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Role } from '@prisma/client';

@Injectable()
export class QuestionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly coursesService: CourseService,
        private readonly userServise: UsersService
    ) { }

    async getAll(user: RequestWithUser['user']) {
        let questions;

        if (user.role === Role.STUDENT) {
            questions = await this.prisma.question.findMany({
                where: { userId: user.id },
                include: { user: true, course: true },
            });

        } else if (
            user.role === Role.MENTOR ||
            user.role === Role.ASSISTANT
        ) {
            questions = await this.prisma.question.findMany({
                where: {
                    course: {
                        assignedCourse: {
                            some: { userId: user.id },
                        },
                    },
                },
                include: { user: true, course: true },
            });

        } else {
            questions = await this.prisma.question.findMany({
                include: { user: true, course: true },
            });
        }

        return responseMessage('', questions);
    }

    async getSingle(id: number) {
        const question = await this.prisma.question.findUnique({ where: { id } });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return responseMessage('', question);
    }

    async create(user: RequestWithUser['user'], payload: CreateQuestionDto, filename?: string) {
        const user_id = user.id
        await this.userServise.getSingle(user_id);
        await this.coursesService.getSingle(payload.courseId, user);

        const data: any = { ...payload, userId: user_id };
        if (filename) {
            data.file_url = filename;
        }

        const newQuestion = await this.prisma.question.create({ data });
        return responseMessage('New Question created', newQuestion);
    }

    async update(id: number, payload: UpdateQuestionDto, filename?: string,) {
        const exists = await this.prisma.question.findUnique({ where: { id } });
        if (!exists) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        if (filename && exists.file_url) {
            removeOldAvatar('questions', exists.file_url);
        }

        const data: any = { ...payload };
        if (filename) {
            data.file_url = filename;
        }

        const updated = await this.prisma.question.update({
            where: { id },
            data,
        });
        return responseMessage('Question updated', updated);
    }

    async delete(id: number) {
        await this.getSingle(id);
        await this.prisma.question.delete({ where: { id } });
        return responseMessage('Question deleted');
    }
}
