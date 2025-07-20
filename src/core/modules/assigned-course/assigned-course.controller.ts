import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AssignedCourseService } from './assigned-course.service';
import { AssignedCourseDto } from './dto/dto';

@Controller('assigned-course')
export class AssignedCourseController {
    constructor(private readonly assignedCourse:AssignedCourseService){}

    @Get()
    getAll(){
        return this.assignedCourse.getAll()
    }

    @Post()
    create(@Body() payload: AssignedCourseDto){
        return this.assignedCourse.create(payload)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id:number, @Body() payload: AssignedCourseDto){
        return this.assignedCourse.update(id, payload)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number,){
        return this.assignedCourse.delete(id)
    }
}
