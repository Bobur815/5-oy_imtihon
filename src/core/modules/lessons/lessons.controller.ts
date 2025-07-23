import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/dto';
import { lessonVideoUpload } from 'src/common/utils/avatar.upload';
import { Public } from 'src/common/decorators/public.decorators';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'List lessons' })
  @Public()
  getAll(@Request() req: RequestWithUser) {
    return this.lessonsService.getAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson' })
  @ApiParam({ name: 'id', type: String })
  @Public()
  getSingle(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.lessonsService.getSingle(req.user, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create lesson' })
  @ApiBody({ type: CreateLessonDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @UseInterceptors(lessonVideoUpload())
  create(
    @Body() payload: CreateLessonDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.lessonsService.create(payload, file.filename);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lesson' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateLessonDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @UseInterceptors(lessonVideoUpload())
  update(
    @Param('id') id: string,
    @Body() payload: UpdateLessonDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.lessonsService.update(id, payload, file.filename);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.lessonsService.delete(id);
  }
}
