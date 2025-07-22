import { Module } from '@nestjs/common';
import { ExamResultController } from './exam-result.controller';
import { ExamResultService } from './exam-result.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { LessonModuleModule } from '../lesson-module/lesson-module.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[PrismaModule, LessonModuleModule, UsersModule],
  controllers: [ExamResultController],
  providers: [ExamResultService]
})
export class ExamResultModule {}
