import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PurchasedCourseService } from './purchased-course.service';
import { PurchasedCourseDto, UpdatePurchasedCourseDto } from './dto/dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Purchased Course')
@ApiBearerAuth()
@Controller('purchased-course')
export class PurchasedCourseController {
  constructor(private readonly purchasedCourseService: PurchasedCourseService) {}

  @Get()
  @ApiOperation({ summary: 'List purchases' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  getAll(@Request() req: RequestWithUser) {
    return this.purchasedCourseService.getAll(req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create purchase' })
  @ApiBody({ type: PurchasedCourseDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  create(@Request() req: RequestWithUser, @Body() payload: PurchasedCourseDto) {
    return this.purchasedCourseService.create(req.user, payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update purchase' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePurchasedCourseDto })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePurchasedCourseDto
  ) {
    return this.purchasedCourseService.update(req.user, id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete purchase' })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.purchasedCourseService.delete(id);
  }
}
