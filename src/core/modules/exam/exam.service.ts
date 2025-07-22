import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto, UpdateExamDto } from './dto/dto';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { LessonModuleService } from '../lesson-module/lesson-module.service';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Role } from '@prisma/client';

@Injectable()
export class ExamService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly lessonModuleService: LessonModuleService,
    ) { }

    async getAll(user: RequestWithUser['user']) {
        let exams;
        if (user.role === Role.STUDENT) {
            // Student faqat sotib olgan kursning exam questionslarni 
            // va o'sha kursning barch darslarini ko'rgandan keyin ko'ra oladi
            exams = await this.prisma.exam.findMany({
                where: {
                    lessonModule: {
                        course: {
                            purchasedCourse: {
                                some: { userId: user.id },
                            },
                        },
                        lessons: {
                            every: {
                                lessonView: {
                                    some: {
                                        userId: user.id,
                                        view: true,
                                    },
                                },
                            },
                        },
                    },
                },
                include: {
                    lessonModule: {
                        include: {
                            course: true,
                        },
                    },
                },
            });
        } else {
            exams = await this.prisma.exam.findMany({
                include: { lessonModule: { include: { course: true } } },
            });
        }
        return responseMessage('', exams);
    }

    async getSingle(id: number) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: { lessonModule: true }
        });
        if (!exam) {
            throw new NotFoundException(`Exam with ID ${id} not found`);
        }
        return responseMessage('', exam);
    }

    async create(payload: CreateExamDto) {
        await this.lessonModuleService.getSingle(payload.lessonModuleId);

        const newExam = await this.prisma.exam.create({
            data: payload,
        });
        return responseMessage('New Exam created', newExam);
    }

    async createMany(payloads: CreateExamDto[]) {
        const uniqueModuleIds = Array.from(
            new Set(payloads.map((p) => p.lessonModuleId)),
        );
        for (const moduleId of uniqueModuleIds) {
            await this.lessonModuleService.getSingle(moduleId);
        }

        const created = await this.prisma.$transaction(
            payloads.map((data) =>
                this.prisma.exam.create({ data }),
            ),
        );

        return responseMessage('New Exams created', created);
    }

    async update(id: number, payload: UpdateExamDto) {
        const exists = await this.prisma.exam.findUnique({ where: { id } });
        if (!exists) {
            throw new NotFoundException(`Exam with ID ${id} not found`);
        }

        if (payload.lessonModuleId) {
            await this.lessonModuleService.getSingle(payload.lessonModuleId);
        }

        const updated = await this.prisma.exam.update({
            where: { id },
            data: { ...payload },
        });
        return responseMessage('Exam updated', updated);
    }

    async delete(id: number) {
        await this.getSingle(id);
        await this.prisma.exam.delete({ where: { id } });
        return responseMessage('Exam deleted');
    }
}
