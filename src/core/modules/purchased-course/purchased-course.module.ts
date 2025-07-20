import { Module } from '@nestjs/common';
import { PurchasedCourseController } from './purchased-course.controller';
import { PurchasedCourseService } from './purchased-course.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports:[PrismaModule],  
  controllers: [PurchasedCourseController],
  providers: [PurchasedCourseService]
})
export class PurchasedCourseModule {}
