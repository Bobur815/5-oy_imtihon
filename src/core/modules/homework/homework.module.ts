import { Module } from '@nestjs/common';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { HomeworkSubmissionController } from './homework-submission/homework-submission.controller';
import { LessonsModule } from '../lessons/lessons.module';
import { HomeworkSubmissionService } from './homework-submission/homework-submission.service';

@Module({
  imports:[PrismaModule, LessonsModule],
  controllers: [HomeworkController,HomeworkSubmissionController],
  providers: [HomeworkService,HomeworkSubmissionService ]
})
export class HomeworkModule {}
