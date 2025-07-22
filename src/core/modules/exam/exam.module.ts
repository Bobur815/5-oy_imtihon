import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { LessonModuleModule } from '../lesson-module/lesson-module.module';

@Module({
  imports:[PrismaModule,LessonModuleModule],
  controllers: [ExamController],
  providers: [ExamService]
})
export class ExamModule {}
