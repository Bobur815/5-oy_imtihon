import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { LessonModuleService } from './lesson-module.service';
import { CreateLessonModuleDto, UpdateLessonModuleDto } from './dto/dto';
import { Public } from 'src/common/decorators/public.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Lesson Module')
@ApiBearerAuth()
@Controller('lesson-module')
export class LessonModuleController {
  constructor(private readonly lessonModuleService: LessonModuleService) {}

  @Get()
  @ApiOperation({ summary: 'List modules' })
  @Public()
  getAll() {
    return this.lessonModuleService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get module' })
  @ApiParam({ name: 'id', type: Number })
  @Public()
  getSingle(@Param('id', ParseIntPipe) id: number) {
    return this.lessonModuleService.getSingle(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create module' })
  @ApiBody({ type: CreateLessonModuleDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  create(@Body() payload: CreateLessonModuleDto) {
    return this.lessonModuleService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update module' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateLessonModuleDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLessonModuleDto
  ) {
    return this.lessonModuleService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete module' })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.lessonModuleService.delete(id);
  }
}
