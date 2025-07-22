import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, } from '@nestjs/swagger';
import { LessonFileService } from './lesson-file.service';
import { CreateLessonFileDto, UpdateLessonFileDto } from './dto/dto';
import { lessonFileUpload } from 'src/common/utils/avatar.upload';

@ApiTags('lesson-file')
@Controller('lesson-file')
export class LessonFileController {
  constructor(private readonly lessonFileService: LessonFileService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lesson files' })
  @ApiResponse({ status: 200, description: 'Returns array of LessonFile' })
  getAll() {
    return this.lessonFileService.getAll();
  }

  @Post()
  @UseInterceptors(lessonFileUpload())
  @ApiOperation({ summary: 'Create a new lesson file' })
  @ApiBody({ type: CreateLessonFileDto })
  @ApiResponse({ status: 201, description: 'LessonFile created' })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateLessonFileDto) {
    return this.lessonFileService.create(payload, file.filename);
  }

  @Put(':id')
  @UseInterceptors(lessonFileUpload())
  @ApiOperation({ summary: 'Update a lesson file by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the LessonFile to update',
  })
  @ApiBody({ type: UpdateLessonFileDto })
  @ApiResponse({ status: 200, description: 'LessonFile updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateLessonFileDto,
  ) {
    return this.lessonFileService.update(id, payload,file?.filename);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson file by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the LessonFile to delete',
  })
  @ApiResponse({ status: 200, description: 'LessonFile deleted' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.lessonFileService.delete(id);
  }
}
