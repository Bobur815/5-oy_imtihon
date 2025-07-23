import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, } from '@nestjs/swagger';
import { LessonFileService } from './lesson-file.service';
import { CreateLessonFileDto, UpdateLessonFileDto } from './dto/dto';
import { lessonFileUpload } from 'src/common/utils/avatar.upload';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('lesson-file')
@ApiBearerAuth()
@Controller('lesson-file')
export class LessonFileController {
    constructor(private readonly lessonFileService: LessonFileService) { }

    @Get()
    @ApiOperation({ summary: 'Get all lesson files' })
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MENTOR)
    @ApiResponse({ status: 200, description: 'Returns array of LessonFile' })
    getAll() {
        return this.lessonFileService.getAll();
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MENTOR)
    @UseInterceptors(lessonFileUpload())
    @ApiOperation({ summary: 'Create a new lesson file' })
    @ApiBody({ type: CreateLessonFileDto })
    @ApiResponse({ status: 201, description: 'LessonFile created' })
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() payload: CreateLessonFileDto) {
        return this.lessonFileService.create(payload, file.filename);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MENTOR)
    @UseInterceptors(lessonFileUpload())
    @ApiOperation({ summary: 'Update a lesson file by ID' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'ID of the LessonFile to update',
    })
    @ApiBody({ type: UpdateLessonFileDto })
    @ApiResponse({ status: 200, description: 'LessonFile updated' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() payload: UpdateLessonFileDto,
    ) {
        return this.lessonFileService.update(id, payload, file?.filename);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a lesson file by ID' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'ID of the LessonFile to delete',
    })
    @ApiResponse({ status: 200, description: 'LessonFile deleted' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.lessonFileService.delete(id);
    }
}
