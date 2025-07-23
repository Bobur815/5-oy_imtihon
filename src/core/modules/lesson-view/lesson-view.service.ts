import { Injectable, NotFoundException } from '@nestjs/common';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateLessonViewDto, UpdateLessonViewDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class LessonViewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(user:RequestWithUser['user']) {
    let where: Prisma.LessonViewWhereInput = {}
    if(user.role === Role.STUDENT){
        where = {userId:user.id}
    }

    const lessonViews = await this.prisma.lessonView.findMany({
      include: {
        user: true,
        lesson: true,
      }, where
    });
    return responseMessage('', lessonViews);
  }

  async create(user:RequestWithUser['user'], data: CreateLessonViewDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: data.lessonId } });

    if (!user) throw new NotFoundException('User not found');
    if (!lesson) throw new NotFoundException('Lesson not found');

    const newView = await this.prisma.lessonView.create({
      data: {
        userId: user.id,
        lessonId: data.lessonId,
        view: data.view ?? false,
      },
    });

    return responseMessage('New lesson view saved', newView);
  }

  async update(id: number, data: UpdateLessonViewDto) {
    const existing = await this.prisma.lessonView.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`LessonView with ID ${id} not found`);

    const updated = await this.prisma.lessonView.update({
      where: { id },
      data,
    });

    return responseMessage('Lesson view updated', updated);
  }

  async delete(id: number) {
    const existing = await this.prisma.lessonView.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`LessonView with ID ${id} not found`);

    await this.prisma.lessonView.delete({ where: { id } });
    return responseMessage('Lesson view deleted');
  }
}
