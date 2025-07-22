import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryDto } from './dto/dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Course-category')
@Controller('course-category')
export class CourseCategoryController {
    constructor(private readonly courseCategory: CourseCategoryService){}

    @Get()
    @Public()
    getAllCategories(){
        return this.courseCategory.getAllCategories()
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() payload: CourseCategoryDto){
        return this.courseCategory.create(payload)
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() payload:CourseCategoryDto){
        return this.courseCategory.update(id, payload)
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    deleteCategory(@Param('id', ParseIntPipe) id: number,){
        return this.courseCategory.deleteCategory(id)
    }
}
