import { Module } from '@nestjs/common';
import { LessonViewController } from './lesson-view.controller';
import { LessonViewService } from './lesson-view.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [LessonViewController],
  providers: [LessonViewService]
})
export class LessonViewModule {}
