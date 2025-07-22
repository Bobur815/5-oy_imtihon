import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateLessonDto, UpdateLessonDto } from './dto/dto';
import { lessonVideoUpload } from 'src/common/utils/avatar.upload';
import { LessonsService } from './lessons.service';
import { Public } from 'src/common/decorators/public.decorators';

@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService){}

    @Get()
    @Public()
    getAll(){
        return this.lessonsService.getAll()
    }

    @Get(':id')
    @Public()
    getSingle(@Param('id') id: string){
        return this.lessonsService.getSingle(id)
    }

    @Post()
    @UseInterceptors(lessonVideoUpload())
    create(@Body() payload: CreateLessonDto, @UploadedFile() file:Express.Multer.File){
        return this.lessonsService.create(payload, file.filename)
    }

    @Put(':id')
    @UseInterceptors(lessonVideoUpload())
    update(
        @Param('id') id:string, 
        @Body() payload: UpdateLessonDto,
        @UploadedFile() file:Express.Multer.File
    ){
        return this.lessonsService.update(id,payload,file.filename)
    }

    @Delete(':id')
    delete(@Param('id') id:string){
        return this.lessonsService.delete(id)
    }
}
