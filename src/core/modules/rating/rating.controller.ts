import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Public } from 'src/common/decorators/public.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateRatingDto, UpdateRatingDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('rating')
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @Get()
    @Public()
    getAll() {
        return this.ratingService.getAll()
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new rating' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    create(
        @Request() req: RequestWithUser,
        @Body() dto: CreateRatingDto,
    ) {
        const user_id = Number(req.user.id)
        return this.ratingService.create(user_id, dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing rating' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRatingDto,
        @Request() req: RequestWithUser,
    ) {
        const user_id = Number(req.user.id)
        return this.ratingService.update(id, user_id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser,){
        const user_id = Number(req.user.id)
        return this.ratingService.delete(id, user_id)
    }
}
