// lesson-view.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { LessonViewService } from './lesson-view.service';
import { CreateLessonViewDto, UpdateLessonViewDto } from './dto/dto';

@ApiTags('lesson-view')
@Controller('lesson-view')
export class LessonViewController {
  constructor(
    private readonly lessonViewService: LessonViewService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all lesson-view records' })
  @ApiResponse({ status: 200, description: 'Returns array of LessonView' })
  getAll() {
    return this.lessonViewService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lesson-view record' })
  @ApiBody({ type: CreateLessonViewDto })
  @ApiResponse({ status: 201, description: 'LessonView created' })
  create(@Body() payload: CreateLessonViewDto) {
    return this.lessonViewService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a lesson-view record by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the LessonView to update',
  })
  @ApiBody({ type: UpdateLessonViewDto })
  @ApiResponse({ status: 200, description: 'LessonView updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLessonViewDto,
  ) {
    return this.lessonViewService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson-view record by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the LessonView to delete',
  })
  @ApiResponse({ status: 200, description: 'LessonView deleted' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.lessonViewService.delete(id);
  }
}
