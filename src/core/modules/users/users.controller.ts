import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUpload } from 'src/common/utils/avatar.upload';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UserFilterDto } from './dto/users-filter.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private jwtService:JwtService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Retrieve all users' })
  getAllUsers(@Request() req:RequestWithUser, @Query() filters: UserFilterDto) {
    return this.usersService.getAllUsers(req.user, filters);
  }

  @Get(':user_id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'user_id',
    description: 'Numeric ID of the user',
    example: 42,
  })
  async getSingle(
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    return this.usersService.getSingle(user_id);
  }

  @Put(':user_id')
  @UseInterceptors(AvatarUpload())
  @ApiOperation({ summary: 'Update a users profile' })
  @ApiParam({
    name: 'user_id',
    example: 42,
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiConsumes('multipart/form-data')

  updateUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateProfileDto,
  ) 
  {
    
    return this.usersService.updateUser(user_id, payload, file?.filename);
  }

  @Delete(':user_id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'user_id',
    example: 42,
  })
  deleteUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    return this.usersService.deleteUser(user_id);
  }
}