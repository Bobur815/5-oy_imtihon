import { ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { CreateQuestionAnswerDto, UpdateQuestionAnswerDto,} from './dto/dto';
import { responseMessage } from 'src/common/utils/response.message';
import { PrismaService } from 'src/core/database/prisma.service';
import { removeOldAvatar } from 'src/common/utils/remove-old-picture';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class QuestionAnswerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionsService: QuestionsService,
  ) {}

  async getAll() {
    const answers = await this.prisma.questionAnswer.findMany({
      include: { question: true, user: true },
    });
    return responseMessage('', answers);
  }

  async getSingle(id: number) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: { id },
    });
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return responseMessage('', answer);
  }

  async create( userId: number, payload: CreateQuestionAnswerDto, filename?: string) {
    payload['questionId'] = Number(payload.questionId)
    await this.questionsService.getSingle(payload.questionId);

    const existing = await this.prisma.questionAnswer.findFirst({
      where: {
        questionId: payload.questionId,
        userId,
      },
    });
    if (existing) {
      throw new ConflictException(
        'You have already answered this question',
      );
    }

    const data: any = { ...payload, userId };
    if (filename) {
      data.file_url = filename;
    }

    const newAnswer = await this.prisma.questionAnswer.create({
      data,
    });
    return responseMessage('Question answer created', newAnswer);
  }

  async update( id: number, userId: number, payload: UpdateQuestionAnswerDto, filename?: string) {
    const exists = await this.prisma.questionAnswer.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }

    if (exists.userId !== userId) {
      throw new ConflictException(`You cannot edit this answer`);
    }

    if (filename && exists.file_url) {
      removeOldAvatar('question-answers', exists.file_url);
    }

    const data: any = { ...payload };
    if (filename) {
      data.file_url = filename;
    }

    const updated = await this.prisma.questionAnswer.update({
      where: { id },
      data,
    });
    return responseMessage('Question answer updated', updated);
  }

  async delete(id: number) {
    await this.getSingle(id);
    await this.prisma.questionAnswer.delete({ where: { id } });
    return responseMessage('Question answer deleted');
  }
}
