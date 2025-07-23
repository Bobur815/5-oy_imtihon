import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { HomeworkSubmissionService } from './homework-submission.service';
import { HomeworkSubmissionDto, UpdateHomeworkSubmissionDto } from './dto/dto';
import { homeworkSubmissionFileUpload } from 'src/common/utils/avatar.upload';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RequestWithUser } from 'src/common/types/request-with-user';

@ApiTags('Homework Submission')
@ApiBearerAuth()
@Controller('homework-submission')
export class HomeworkSubmissionController {
  constructor(private readonly homeworkSubmissionService: HomeworkSubmissionService) {}

  @Get()
  @ApiOperation({ summary: 'List submissions' })
  getAll(@Request() req: RequestWithUser) {
    return this.homeworkSubmissionService.getAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get submission' })
  @ApiParam({ name: 'id', type: Number })
  getSingle(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.homeworkSubmissionService.getSingle(req.user, id);
  }

  @Post()
  @ApiOperation({ summary: 'Upload submission' })
  @ApiBody({ type: HomeworkSubmissionDto })
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @UseInterceptors(homeworkSubmissionFileUpload())
  create(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: HomeworkSubmissionDto
  ) {
    return this.homeworkSubmissionService.create(req.user, payload, file.filename);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update submission' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateHomeworkSubmissionDto })
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @UseInterceptors(homeworkSubmissionFileUpload())
  update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateHomeworkSubmissionDto
  ) {
    return this.homeworkSubmissionService.update(req.user, id, payload, file?.filename);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete submission' })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.homeworkSubmissionService.delete(req.user, id);
  }
}