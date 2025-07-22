import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { CourseModule } from '../course/course.module';
import { LessonModuleModule } from '../lesson-module/lesson-module.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[PrismaModule, CourseModule, UsersModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports:[QuestionsService]
})
export class QuestionsModule {}
