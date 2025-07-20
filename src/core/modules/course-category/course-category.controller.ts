import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryDto } from './dto/dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators.ts/public.decorators';

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
    create(@Body() payload: CourseCategoryDto){
        return this.courseCategory.create(payload)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload:CourseCategoryDto){
        return this.courseCategory.update(id, payload)
    }

    @Delete(':id')
    deleteCategory(@Param('id', ParseIntPipe) id: number,){
        return this.courseCategory.deleteCategory(id)
    }
}
