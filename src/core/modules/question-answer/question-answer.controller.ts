import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UploadedFile, UseInterceptors, HttpCode, HttpStatus, UseGuards,} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody,} from '@nestjs/swagger';
import { QuestionAnswerService } from './question-answer.service';
import { questionAnswerFileUpload } from 'src/common/utils/avatar.upload';
import { CreateQuestionAnswerDto, UpdateQuestionAnswerDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('question-answers')
@Controller('question-answer')
export class QuestionAnswerController {
  constructor(
    private readonly questionAnswerService: QuestionAnswerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all question answers' })
  getAll() {
    return this.questionAnswerService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single question answer by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Answer ID' })
  getSingle(@Param('id', ParseIntPipe) id: number) {
    return this.questionAnswerService.getSingle(id);
  }

  @Post()
  @UseInterceptors(questionAnswerFileUpload())
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT, Role.MENTOR)
  @ApiOperation({ summary: 'Create a new question answer' })
  @ApiConsumes('multipart/form-data')
  create(
    @Request() req: RequestWithUser,
    @Body() payload: CreateQuestionAnswerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.questionAnswerService.create(
      req.user.id,
      payload,
      file?.filename,
    );
  }

  @Put(':id')
  @UseInterceptors(questionAnswerFileUpload())
  @Roles(Role.ADMIN, Role.MENTOR, Role.ASSISTANT)
  @ApiOperation({ summary: 'Update an existing question answer' })
  @ApiParam({ name: 'id', type: Number, description: 'Answer ID' })
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
    @Body() payload: UpdateQuestionAnswerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.questionAnswerService.update(
      id,
      req.user.id,
      payload,
      file?.filename,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a question answer' })
  @ApiParam({ name: 'id', type: Number, description: 'Answer ID' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.questionAnswerService.delete(id);
  }
}
