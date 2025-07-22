import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LessonModuleService } from './lesson-module.service';
import { CreateLessonModuleDto, UpdateLessonModuleDto } from './dto/dto';
import { Public } from 'src/common/decorators/public.decorators';

@Controller('lesson-module')
export class LessonModuleController {
    constructor(private readonly lessonModuleService: LessonModuleService){}

    @Get()
    @Public()
    getAll(){
        return this.lessonModuleService.getAll()
    }

    @Get(':id')
    @Public()
    getSingle(@Param('id', ParseIntPipe) id: number){
        return this.lessonModuleService.getSingle(id)
    }

    @Post()
    create(@Body() payload: CreateLessonModuleDto){
        return this.lessonModuleService.create(payload)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateLessonModuleDto){
        return this.lessonModuleService.update(id,payload)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number,){
        return this.lessonModuleService.delete(id)
    }
}
