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
import { LessonModuleModule } from './core/modules/lesson-module/lesson-module.module';
import { LessonsModule } from './core/modules/lessons/lessons.module';
import { LastActivityModule } from './core/modules/last-activity/last-activity.module';
import { LessonViewModule } from './core/modules/lesson-view/lesson-view.module';
import { LessonFileModule } from './core/modules/lesson-file/lesson-file.module';
import { HomeworkModule } from './core/modules/homework/homework.module';
import { ExamModule } from './core/modules/exam/exam.module';
import { ExamResultModule } from './core/modules/exam-result/exam-result.module';
import { QuestionsModule } from './core/modules/questions/questions.module';
import { QuestionAnswerModule } from './core/modules/question-answer/question-answer.module';
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
    RatingModule,
    LessonModuleModule,
    LessonsModule,
    LastActivityModule,
    LessonViewModule,
    LessonFileModule,
    HomeworkModule,
    ExamModule,
    ExamResultModule,
    QuestionsModule,
    QuestionAnswerModule,
  ],
  controllers: [],
  providers: [AdminSeeder],
})
export class AppModule {}
