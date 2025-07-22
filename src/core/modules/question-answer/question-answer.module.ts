import { Module } from '@nestjs/common';
import { QuestionAnswerController } from './question-answer.controller';
import { QuestionAnswerService } from './question-answer.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports:[PrismaModule,QuestionsModule],
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService]
})
export class QuestionAnswerModule {}
