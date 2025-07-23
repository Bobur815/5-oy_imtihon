import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateHomeWorkDto, UpdateHomeWorkDto } from './dto/dto';
import { homeworkFileUpload } from 'src/common/utils/avatar.upload';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RequestWithUser } from 'src/common/types/request-with-user';

@ApiTags('homework')
@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
    constructor(private readonly homeworkService: HomeworkService) { }

    @Get()
    @ApiOperation({ summary: 'Get all homework tasks' })
    getAll(@Request() req: RequestWithUser) {
        return this.homeworkService.getAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get all homework tasks' })
    getSingle(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser) {
        return this.homeworkService.getSingle(id, req.user)
    }


    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.MENTOR)
    @UseInterceptors(homeworkFileUpload())
    @ApiOperation({ summary: 'Create new homework' })
    create(
        @Request() req: RequestWithUser,
        @UploadedFile() file: Express.Multer.File,
        @Body() payload: CreateHomeWorkDto
    ) {
        return this.homeworkService.create(payload, req.user, file?.filename);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.MENTOR)
    @UseInterceptors(homeworkFileUpload())
    @ApiOperation({ summary: 'Update existing homework' })
    @ApiParam({ name: 'id', type: Number })
    update(
        @Request() req: RequestWithUser,
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateHomeWorkDto,
    ) {
        return this.homeworkService.update(id, payload, req.user, file?.filename);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.MENTOR)
    @ApiOperation({ summary: 'Remove Homework ' })
    @ApiParam({ name: 'id', type: Number, description: 'Deleting homework ID' })
    delete(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser) {
        return this.homeworkService.delete(id, req.user);
    }
}
