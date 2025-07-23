import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, } from '@nestjs/swagger';
import { ExamResultService } from './exam-result.service';
import { CreateExamResultDto, UpdateExamResultDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('exam-results')
@ApiBearerAuth()
@Controller('exam-results')
export class ExamResultController {
    constructor(private readonly examResultService: ExamResultService) { }

    @Get()
    @ApiOperation({ summary: 'Get all exam results' })
    getAll(@Request() req: RequestWithUser) {
        return this.examResultService.getAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single exam result by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ExamResult ID' })
    getSingle(@Param('id', ParseIntPipe) id: number) {
        return this.examResultService.getSingle(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Create a new exam result' })
    @ApiBody({ type: CreateExamResultDto })
    create(
        @Request() req: RequestWithUser,
        @Body() payload: CreateExamResultDto
    ) {
        return this.examResultService.create(req.user,payload);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.MENTOR)
    @ApiOperation({ summary: 'Update an existing exam result' })
    @ApiParam({ name: 'id', type: Number, description: 'ExamResult ID' })
    @ApiBody({ type: UpdateExamResultDto })
    update(
        @Request() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateExamResultDto,
    ) {
        return this.examResultService.update(req.user,id, payload);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.MENTOR)
    @ApiOperation({ summary: 'Delete an exam result' })
    @ApiParam({ name: 'id', type: Number, description: 'ExamResult ID' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.examResultService.delete(id);
    }
}
