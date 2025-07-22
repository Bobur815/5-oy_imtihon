import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto, UpdateExamDto } from './dto/dto';
import { Exam as ExamModel, Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RequestWithUser } from 'src/common/types/request-with-user';

@ApiTags('exams')
@Controller('exams')
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    @Get()
    @ApiOperation({ summary: 'Get all exams' })
    getAll(@Request() req:RequestWithUser) {
        return this.examService.getAll(req.user);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.ASSISTANT, Role.MENTOR)
    @ApiOperation({ summary: 'Get a single exam by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Exam ID' })
    getSingle(@Param('id', ParseIntPipe) id: number,) {
        return this.examService.getSingle(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MENTOR)
    @ApiOperation({ summary: 'Create a new exam' })
    @ApiBody({ type: CreateExamDto })
    create(@Body() payload: CreateExamDto) {
        return this.examService.create(payload);
    }

    @Post('bulk')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MENTOR)
    @ApiOperation({ summary: 'Create one or more exams' })
    @ApiBody({ type: [CreateExamDto] })
    createMany(@Body() payloads: CreateExamDto[]) {
        return this.examService.createMany(payloads);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.ASSISTANT, Role.MENTOR)
    @ApiOperation({ summary: 'Update an existing exam' })
    @ApiParam({ name: 'id', type: Number, description: 'Exam ID' })
    @ApiBody({ type: UpdateExamDto })
    update(
        @Body() payload: UpdateExamDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.examService.update(id, payload);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.MENTOR)
    @ApiOperation({ summary: 'Delete an exam' })
    @ApiParam({ name: 'id', type: Number, description: 'Exam ID' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.examService.delete(id);
    }
}
