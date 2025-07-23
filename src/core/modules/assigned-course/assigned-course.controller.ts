import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AssignedCourseService } from './assigned-course.service';
import { AssignedCourseDto } from './dto/dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Assigned Course')
@ApiBearerAuth()
@Controller('assigned-course')
export class AssignedCourseController {
  constructor(private readonly assignedCourseService: AssignedCourseService) {}

  @Get()
  @ApiOperation({ summary: 'List assignments' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.assignedCourseService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create assignment' })
  @ApiBody({ type: AssignedCourseDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() payload: AssignedCourseDto) {
    return this.assignedCourseService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update assignment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AssignedCourseDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: AssignedCourseDto
  ) {
    return this.assignedCourseService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assignment' })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.assignedCourseService.delete(id);
  }
}
