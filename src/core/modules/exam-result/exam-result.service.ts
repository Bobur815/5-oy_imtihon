import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { LessonModuleService } from '../lesson-module/lesson-module.service';
import { UsersService } from '../users/users.service';
import { CreateExamResultDto, UpdateExamResultDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Role } from '@prisma/client';

@Injectable()
export class ExamResultService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly lessonModuleService: LessonModuleService,
        private readonly userService: UsersService,
    ) { }

    async getAll(user: RequestWithUser['user']) {
        const include = { lessonModule: true, user: true };

        // Default bo‘sh filter — admin hamma natijani ko‘radi
        let where: any = {};

        if (user.role === Role.STUDENT) {

            // Student faqat o‘z natijalarini ko‘radi
            where = { userId: user.id };
        } else if (user.role === Role.MENTOR || user.role === Role.ASSISTANT) {

            // Mentor va assistant — o‘ziga tegishli kurslarni exam natijalarini ko'radi
            where = {
                lessonModule: {
                    course: {
                        assignedCourse: {
                            some: { userId: user.id }
                        }
                    }
                }
            };
        }

        const results = await this.prisma.examResult.findMany({
            where,
            include,
        });

        return responseMessage('', results);
    }

    async getSingle(id: number) {
        const result = await this.prisma.examResult.findUnique({
            where: { id },
        });
        if (!result) {
            throw new NotFoundException(`ExamResult with ID ${id} not found`);
        }
        return responseMessage('', result);
    }

    async create(user:RequestWithUser['user'],payload: CreateExamResultDto) {
        await this.lessonModuleService.getSingle(payload.lessonModuleId);
        await this.userService.getSingle(user.id);

        const existing = await this.prisma.examResult.findFirst({
            where: {
                lessonModuleId: payload.lessonModuleId,
                userId: user.id,
            },
        });
        if (existing) {
            throw new ConflictException('Exam result already exists for this user and module');
        }

        const newResult = await this.prisma.examResult.create({
            data: { ...payload, userId:user.id },
        });
        return responseMessage('ExamResult created', newResult);
    }

    async update(user:RequestWithUser['user'],id: number, payload: UpdateExamResultDto) {
        const exists = await this.prisma.examResult.findUnique({
            where: { id },
        });
        if (!exists) {
            throw new NotFoundException(`ExamResult with ID ${id} not found`);
        }

        if (payload.lessonModuleId) {
            await this.lessonModuleService.getSingle(payload.lessonModuleId);
        }
        await this.userService.getSingle(user.id);

        const updated = await this.prisma.examResult.update({
            where: { id },
            data: { ...payload },
        });
        return responseMessage('ExamResult updated', updated);
    }

    async delete(id: number) {
        await this.getSingle(id);
        await this.prisma.examResult.delete({ where: { id } });
        return responseMessage('ExamResult deleted');
    }
}
