import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto/create-course.dto';
import { filesUploader } from 'src/common/utils/avatar.upload';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CourseLevel, Role } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorators';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CourseFilterDto } from './dto/course-filter.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Course')
@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Get()
    @Public()
    getAllCourses(@Request() req: RequestWithUser, @Query() filters: CourseFilterDto) {
        return this.courseService.getAllCourses(req.user, filters)
    }

    @Get(':id')
    @Public()
    getSingle(@Param('id') id: string, @Request() req: RequestWithUser){
        return this.courseService.getSingle(id, req.user)
    }

    @Post()
    @UseInterceptors(filesUploader())
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
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
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    deleteCourse(@Param('id') id: string,) {
        return this.courseService.deleteCourse(id)
    }
}
