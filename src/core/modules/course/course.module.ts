import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports:[CourseService]
})
export class CourseModule {}
