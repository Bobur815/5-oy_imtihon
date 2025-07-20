import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRatingDto, UpdateRatingDto } from './dto/dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { responseMessage } from 'src/common/utils/response.message';

@Injectable()
export class RatingService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll() {
        const ratings = await this.prisma.rating.findMany({
            include: {
                user: { 
                    select: { 
                    id: true, 
                    fullName: true, 
                    role:true 
                } 
            },
                course: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return responseMessage("", ratings)
    }

    async create(userId: number, payload: CreateRatingDto) {
        const course = await this.prisma.course.findUnique({
            where: { id: payload.courseId },
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${payload.courseId} not found`);
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const newRating = await this.prisma.rating.create({
            data: {
                rate: payload.rate,
                comment: payload.comment,
                courseId: payload.courseId,
                userId,
            },
        });
        return responseMessage("New rating successfully saved", newRating)
    }

    async update(id: number, userId: number, payload: UpdateRatingDto) {
        const existing = await this.prisma.rating.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new NotFoundException(`Rating with ID ${id} not found`);
        }
        if (existing.userId !== userId) {
            throw new UnauthorizedException(`You can only modify your own ratings`);
        }

        const updated = await this.prisma.rating.update({
            where: { id },
            data: {
                ...payload
            },
        });
        return responseMessage("Rating updated", updated)
    }

    async delete(id: number, userId: number) {
        const existing = await this.prisma.rating.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new NotFoundException(`Rating with ID ${id} not found`);
        }
        if (existing.userId !== userId) {
            throw new UnauthorizedException(`You can only delete your own ratings`);
        }

        await this.prisma.rating.delete({
            where: { id },
        });
        return responseMessage('Rating deleted successfully');
    }
}
