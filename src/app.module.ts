import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { UsersModule } from './core/modules/users/users.module';
import { AuthModule } from './core/modules/auth/auth.module';
import { RedisModule } from './common/redis/redis.module';
import { VerificationModule } from './core/modules/verification/verification.module';
import { ConfigModule } from '@nestjs/config';
import { AdminSeeder } from './common/utils/admin.seedor';
import { CourseCategoryModule } from './core/modules/course-category/course-category.module';
import { CourseModule } from './core/modules/course/course.module';
import { AssignedCourseModule } from './core/modules/assigned-course/assigned-course.module';
import { PurchasedCourseModule } from './core/modules/purchased-course/purchased-course.module';
import { RatingModule } from './core/modules/rating/rating.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    RedisModule,
    VerificationModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CourseCategoryModule,
    CourseModule,
    AssignedCourseModule,
    PurchasedCourseModule,
    RatingModule
  ],
  controllers: [],
  providers: [AdminSeeder],
})
export class AppModule {}
