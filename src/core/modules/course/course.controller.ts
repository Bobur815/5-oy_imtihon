import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFilterDto } from './dto/course-filter.dto';
import { filesUploader } from 'src/common/utils/avatar.upload';
import { Public } from 'src/common/decorators/public.decorators';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CourseLevel, Role } from '@prisma/client';

@ApiTags('Course')
@ApiBearerAuth()
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'List courses' })
  @Public()
  getAllCourses(
    @Request() req: RequestWithUser,
    @Query() filters: CourseFilterDto
  ) {
    return this.courseService.getAllCourses(req.user, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course' })
  @ApiParam({ name: 'id', type: String })
  @Public()
  getSingle(
    @Param('id') id: string,
    @Request() req: RequestWithUser
  ) {
    return this.courseService.getSingle(id, req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create course' })
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
        mentorId: { type: 'number' }
      }
    }
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(filesUploader())
  create(
    @UploadedFiles() files: { banner_url?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
    @Body() payload: CourseDto
  ) {
    const banner = files.banner_url?.[0]?.filename;
    if (!banner) {
      throw new NotFoundException('Banner picture is required');
    }
    const video = files.introVideo?.[0]?.filename;
    return this.courseService.create(payload, banner, video);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update course' })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCourseDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(filesUploader())
  update(
    @Param('id') id: string,
    @UploadedFiles() files: { banner_url?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
    @Body() payload: UpdateCourseDto
  ) {
    const banner = files.banner_url?.[0]?.filename;
    const video = files.introVideo?.[0]?.filename;
    return this.courseService.update(id, payload, banner, video);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
