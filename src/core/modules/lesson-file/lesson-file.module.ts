import { Module } from '@nestjs/common';
import { LessonFileController } from './lesson-file.controller';
import { LessonFileService } from './lesson-file.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [LessonFileController],
  providers: [LessonFileService]
})
export class LessonFileModule {}
