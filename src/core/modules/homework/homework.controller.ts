import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateHomeWorkDto, UpdateHomeWorkDto } from './dto/dto';
import { homeworkFileUpload } from 'src/common/utils/avatar.upload';

@ApiTags('homework')
@Controller('homework')
export class HomeworkController {
    constructor(private readonly homeworkService: HomeworkService) { }

    @Get()
    @ApiOperation({ summary: 'Get all homework tasks' })
    getAll() {
        return this.homeworkService.getAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get all homework tasks' })
    getSingle(@Param('id', ParseIntPipe) id: number) {
        return this.homeworkService.getSingle(id)
    }


    @Post()
    @UseInterceptors(homeworkFileUpload())
    @ApiOperation({ summary: 'Create new homework' })
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() payload: CreateHomeWorkDto
    ) {
        return this.homeworkService.create(payload, file?.filename);
    }

    @Put(':id')
    @UseInterceptors(homeworkFileUpload())
    @ApiOperation({ summary: 'Update existing homework' })
    @ApiParam({ name: 'id', type: Number })
    update(
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateHomeWorkDto,
    ) {
        return this.homeworkService.update(id, payload,file?.filename);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove Homework ' })
    @ApiParam({ name: 'id', type: Number, description: 'Deleting homework ID' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.homeworkService.delete(id);
    }
}
