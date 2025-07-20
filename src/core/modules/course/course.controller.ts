import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto/create-course.dto';
import { filesUploader } from 'src/common/utils/avatar.upload';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { Public } from 'src/common/decorators.ts/public.decorators';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Course')
@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Get()
    @Public()
    getAllCourses() {
        return this.courseService.getAllCourses()
    }

    @Post()
    @UseInterceptors(filesUploader())
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                about: { type: 'string' },
                price: { type: 'number' },
                banner_url: { type: 'string', format: 'binary' },
                introVideo: { type: 'string', format: 'binary' },
                level: { enum: Object.values(CourseLevel), type: 'string' },
                published: { type: 'boolean' },
                categoryId: { type: 'number' },
                mentorId: { type: 'number' },
            },
        },
    })
    create(
        @UploadedFiles() files: { banner_url?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
        @Body() payload: CourseDto,
    ) {

        const banner = files.banner_url?.[0]?.filename;
        if (!banner) {
            throw new NotFoundException("Banner picture is required")
        }

        const video = files.introVideo?.[0]?.filename;
        return this.courseService.create(payload, banner, video);
    }

    @Put(':id')
    @UseInterceptors(filesUploader())
    @ApiConsumes('multipart/form-data')
    update(
        @Param('id') id: string,
        @UploadedFiles() files: { banner_url?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
        @Body() payload: UpdateCourseDto,
    ) {
        const banner = files.banner_url?.[0]?.filename;
        const video = files.introVideo?.[0]?.filename;
        return this.courseService.update(id, payload, banner, video)
    }

    @Delete(':id')
    deleteCourse(@Param('id') id: string,) {
        return this.courseService.deleteCourse(id)
    }
}
