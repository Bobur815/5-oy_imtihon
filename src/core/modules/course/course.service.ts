import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourseDto } from './dto/create-course.dto';
import { responseMessage } from 'src/common/utils/response.message';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Role } from '@prisma/client';
import { CourseFilterDto } from './dto/course-filter.dto';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCourses(user: RequestWithUser['user'], filters: CourseFilterDto) {
        const where: any = {};

        if (user.role === Role.STUDENT) {
            where.published = true;
            where.purchasedCourse = { some: { userId: user.id } };
        } else if (user.role === Role.MENTOR || user.role === Role.ASSISTANT) {
            where.assignedCourse = { some: { userId: user.id } };
        }
        else if (filters.published !== undefined) {
            where.published = filters.published;
        }

        if (filters.categoryId !== undefined) {
            where.categoryId = filters.categoryId;
        }
        if (filters.level) {
            where.level = filters.level;
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = filters.maxPrice;
            }
        }

        const courses = await this.prisma.course.findMany({
            where,
            include: {
                category: { select: { name: true } },
                ratings: { select: { rate: true } },
            },
        });

        const enriched = courses.map((c) => {
            const sum = c.ratings.reduce((s, r) => s + r.rate, 0);
            const avg = c.ratings.length ? sum / c.ratings.length : 0;
            const { ratings, ...rest } = c;
            return { ...rest, avgRating: avg };
        });

        return responseMessage('', enriched);
    }

    async getSingle( id: string, user: RequestWithUser['user']) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                category: { select: { name: true } },
                ratings: { select: { rate: true } },
                assignedCourse: { select: { userId: true } },
                purchasedCourse: { select: { userId: true } },
            },
        });
        if (!course) {
            throw new NotFoundException(`Course with id ${id} not found`);
        }

        if (user.role === Role.STUDENT) {
            const bought = course.purchasedCourse.some((pc) => pc.userId === user.id);
            if (!course.published || !bought) {
                throw new NotFoundException(`Course not available`);
            }
        } else if (
            user.role === Role.MENTOR ||
            user.role === Role.ASSISTANT
        ) {
            const assigned = course.assignedCourse.some((ac) => ac.userId === user.id,);
            if (!assigned) {
                throw new NotFoundException(`Course not available`);
            }
        }
        const sum = course.ratings.reduce((s, r) => s + r.rate, 0);
        const avg = course.ratings.length ? sum / course.ratings.length : 0;
        const { ratings, assignedCourse, purchasedCourse, ...rest } = course;

        return responseMessage('', { ...rest, avgRating: avg });
    }

    async create(payload: CourseDto, banner_url: string, introVideo?: string) {
        const course = await this.prisma.course.findFirst({
            where: { name: payload.name }
        })
        if (course) {
            throw new ConflictException(`Course with name ${payload.name} exists`)
        }
        const price = Number(payload.price)
        const categoryId = Number(payload.categoryId)

        const newCourse = await this.prisma.course.create({
            data: {
                ...payload,
                price,
                categoryId,
                banner_url,
                introVideo
            }
        })
        return responseMessage("New Course successfully created", newCourse)
    }

    async update(id: string, payload: UpdateCourseDto, banner_url?: string, introVideo?: string) {
        const course = await this.prisma.course.findUnique({
            where: { id }
        })

        if (!course) {
            throw new NotFoundException(`Course with id ${id} not found`)
        }

        if (banner_url && course.banner_url) {
            removeOldAvatar('course', course.banner_url)
            payload['banner_url'] = banner_url
        }

        if (introVideo && course.introVideo) {
            removeOldAvatar('course', course.introVideo)
            payload['introVideo'] = introVideo
        }

        const updatedCourse = await this.prisma.course.update({
            data: {
                ...payload
            },
            where: { id }
        })

        return responseMessage("Course successfully updated", updatedCourse)
    }

    async deleteCourse(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id }
        })

        if (!course) {
            throw new NotFoundException(`Course with id ${id} not found`)
        }

        await this.prisma.course.delete({
            where: { id }
        })

        return responseMessage("Course successfully deleted")
    }
}
