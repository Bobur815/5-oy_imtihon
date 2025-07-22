import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { HomeworkSubmissionService } from './homework-submission.service';
import { HomeworkSubmissionDto, UpdateHomeworkSubmissionDto } from './dto/dto';
import { homeworkSubmissionFileUpload } from 'src/common/utils/avatar.upload';

@Controller('homework-submission')
export class HomeworkSubmissionController {
    constructor(private readonly homeworkSubmissionService: HomeworkSubmissionService){}

    @Get()
    getAll(){
        return this.homeworkSubmissionService.getAll()
    }

    @Get(':id')
    getSingle(@Param('id',ParseIntPipe) id: number){
        return this.homeworkSubmissionService.getSingle(id)
    }

    @Post()
    @UseInterceptors(homeworkSubmissionFileUpload())
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() payload: HomeworkSubmissionDto
    ){
        return this.homeworkSubmissionService.create(payload,file.filename)
    }

    @Put(':id')
    @UseInterceptors(homeworkSubmissionFileUpload())
    update(
        @Param('id',ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() payload: UpdateHomeworkSubmissionDto
    ){
        return this.homeworkSubmissionService.update(id,payload,file?.filename)
    }

    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number,){
        return this.homeworkSubmissionService.delete(id)
    }
}
