import { Module } from '@nestjs/common';
import { AssignedCourseController } from './assigned-course.controller';
import { AssignedCourseService } from './assigned-course.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [AssignedCourseController],
  providers: [AssignedCourseService]
})
export class AssignedCourseModule {}
