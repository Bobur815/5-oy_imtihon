// lesson-view.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { LessonViewService } from './lesson-view.service';
import { CreateLessonViewDto, UpdateLessonViewDto } from './dto/dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/types/request-with-user';

@ApiTags('lesson-view')
@Controller('lesson-view')
export class LessonViewController {
    constructor(
        private readonly lessonViewService: LessonViewService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all lesson-view records' })
    @ApiResponse({ status: 200, description: 'Returns array of LessonView' })
    getAll(@Request() req: RequestWithUser) {
        return this.lessonViewService.getAll(req.user);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new lesson-view record' })
    @ApiBody({ type: CreateLessonViewDto })
    @ApiResponse({ status: 201, description: 'LessonView created' })
    create(@Request() req: RequestWithUser, @Body() payload: CreateLessonViewDto) {
        return this.lessonViewService.create(req.user, payload);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a lesson-view record by ID' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'ID of the LessonView to update',
    })
    @ApiBody({ type: UpdateLessonViewDto })
    @ApiResponse({ status: 200, description: 'LessonView updated' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateLessonViewDto,
    ) {
        return this.lessonViewService.update(id, payload);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a lesson-view record by ID' })
    @ApiParam({
        name: 'id',
        type: 'integer',
        description: 'ID of the LessonView to delete',
    })
    @ApiResponse({ status: 200, description: 'LessonView deleted' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.lessonViewService.delete(id);
    }
}
