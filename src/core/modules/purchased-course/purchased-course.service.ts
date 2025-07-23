import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { PurchasedCourseDto, UpdatePurchasedCourseDto } from './dto/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class PurchasedCourseService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(user: RequestWithUser['user']) {
        let where: Prisma.PurchasedCourseWhereInput = {}
        if(user.role === Role.STUDENT){
            where = {userId:user.id}
        }

        const purchasedCourses = await this.prisma.purchasedCourse.findMany({
            include: {
                course: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        fullName: true,
                        role: true
                    }
                }
            }, where
        })
        return responseMessage("", purchasedCourses)
    }

    async create(user: RequestWithUser['user'], payload: PurchasedCourseDto) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const course = await prisma.course.findUnique({
                    where: { id: payload.courseId },
                });
                if (!course) {
                    throw new NotFoundException(
                        `Course with ID ${payload.courseId} not found`,
                    );
                }

                if (!user.id) {
                    throw new NotFoundException(
                        `User with ID ${user.id} not found`,
                    );
                }

                if (course.price > payload.amount) {
                    throw new ConflictException('Insufficient amount');
                }

                const purchase = await prisma.purchasedCourse.create({
                    data: {
                        userId: user.id,
                        courseId: payload.courseId,
                        amount: payload.amount,
                        paidVia: payload.paidVia,
                    },
                });

                return purchase;
            });

            return responseMessage('New purchase successfully saved', result);
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError &&
                err.code === 'P2002' &&
                (err.meta?.target as string[]).includes('userId_courseId')
            ) {
                throw new ConflictException(
                    `User ${user.id} has already purchased course ${payload.courseId}`,
                );
            }
            throw err;
        }
    }

    async update(user: RequestWithUser['user'], id: number, payload: UpdatePurchasedCourseDto) {
        const existing = await this.prisma.purchasedCourse.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Purchase ${id} not found`);
        }

        const newCourseId = payload.courseId ?? existing.courseId;
        const newAmount = payload.amount ?? existing.amount;
        const newPaidVia = payload.paidVia ?? existing.paidVia;

        const course = await this.prisma.course.findUnique({ where: { id: newCourseId } });
        if (!course) {
            throw new NotFoundException(`Course ${newCourseId} not found`);
        }

        if (course.price > newAmount) {
            throw new ConflictException('Insufficient amount');
        }

        if (!user.id) {
            throw new NotFoundException(`User with ID ${user.id} not found`);
        }

        const updated = await this.prisma.purchasedCourse.update({
            where: { id },
            data: {
                courseId: newCourseId,
                amount: newAmount,
                paidVia: newPaidVia,
            },
        });

        return responseMessage('Purchase updated', updated);
    }


    async delete(id: number) {
        const purchase = await this.prisma.purchasedCourse.findUnique({
            where: { id }
        })

        if (!purchase) {
            throw new NotFoundException(`Purchase with ID ${id} not found`)
        }

        await this.prisma.purchasedCourse.delete({
            where: { id }
        })

        return responseMessage("Purchase successfully deleted")
    }
}
