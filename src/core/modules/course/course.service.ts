import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourseDto } from './dto/create-course.dto';
import { responseMessage } from 'src/common/utils/response.message';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCourses() {
        const courses = await this.prisma.course.findMany({
            include: {
                category: { select: { name: true } },
                ratings: { select: { rate: true } },
            },
        });

        const coursesWithAvgRating = courses.map((c) => {
            const sum = c.ratings.reduce((s, r) => s + r.rate, 0);
            const avg = c.ratings.length ? sum / c.ratings.length : 0;
            const { ratings, ...rest } = c;
            return { ...rest, avgRating: avg };
        });
        return responseMessage("", coursesWithAvgRating)
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
            await removeOldAvatar('course', course.banner_url)
            payload['banner_url'] = banner_url
        }

        if (introVideo && course.introVideo) {
            await removeOldAvatar('course', course.introVideo)
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
