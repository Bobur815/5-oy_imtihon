import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/dto';
import { questionFileUpload } from 'src/common/utils/avatar.upload';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all questions' })
    getAll(@Request() req:RequestWithUser) {
        return this.questionsService.getAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single question by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Question ID' })
    getSingle(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.getSingle(id);
    }

    @Post()
    @UseInterceptors(questionFileUpload())
    @ApiOperation({ summary: 'Create a new question (optionally with file)' })
    @ApiConsumes('multipart/form-data')
    create(
        @Request() req:RequestWithUser,
        @Body() payload: CreateQuestionDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.questionsService.create(req.user, payload, file?.filename);
    }

    @Put(':id')
    @UseInterceptors(questionFileUpload())
    @ApiOperation({ summary: 'Update a question (optionally with new file)' })
    @ApiParam({ name: 'id', type: Number, description: 'Question ID' })
    @ApiConsumes('multipart/form-data')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateQuestionDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.questionsService.update(id, payload, file?.filename);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a question' })
    @ApiParam({ name: 'id', type: Number, description: 'Question ID' })
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.questionsService.delete(id);
    }
}
