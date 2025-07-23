import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Public } from 'src/common/decorators/public.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateRatingDto, UpdateRatingDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Rating')
@ApiBearerAuth()
@Controller('rating')
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @Get()
    @Public()
    getAll() {
        return this.ratingService.getAll()
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Create a new rating' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    create(
        @Request() req: RequestWithUser,
        @Body() dto: CreateRatingDto,
    ) {
        return this.ratingService.create(req.user.id, dto);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing rating' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRatingDto,
        @Request() req: RequestWithUser,
    ) {
        return this.ratingService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT,Role.ADMIN)
    delete(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser,){
        const user_id = Number(req.user.id)
        return this.ratingService.delete(id, user_id)
    }
}
