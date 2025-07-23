import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryDto } from './dto/dto';
import { Public } from 'src/common/decorators/public.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Course Category')
@ApiBearerAuth()
@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'List categories' })
  @Public()
  getAllCategories() {
    return this.courseCategoryService.getAllCategories();
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CourseCategoryDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() payload: CourseCategoryDto) {
    return this.courseCategoryService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CourseCategoryDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CourseCategoryDto
  ) {
    return this.courseCategoryService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoryService.deleteCategory(id);
  }
}