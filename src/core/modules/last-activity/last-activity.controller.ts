import {  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LastActivityService } from './last-activity.service';
import { CreateLastActivityDto, UpdateLastActivityDto } from './dto/last-activitydto';
import { RequestWithUser } from 'src/common/types/request-with-user';

@ApiTags('last-activity')
@ApiBearerAuth()
@Controller('last-activity')
export class LastActivityController {
  constructor(private readonly lastActivityService: LastActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all last-activity records' })
  @ApiResponse({ status: 200, description: 'List of last-activity records returned.' })
  getAll(@Request() req: RequestWithUser) {
    return this.lastActivityService.getAll(req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new last-activity record' })
  @ApiBody({ type: CreateLastActivityDto })
  @ApiResponse({ status: 201, description: 'Last-activity record created.' })
  create(@Body() payload: CreateLastActivityDto) {
    return this.lastActivityService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a last-activity record by ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Record ID' })
  @ApiBody({ type: UpdateLastActivityDto })
  @ApiResponse({ status: 200, description: 'Last-activity record updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLastActivityDto,
  ) {
    return this.lastActivityService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a last-activity record by ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Last-activity record deleted.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.lastActivityService.delete(id);
  }
}
