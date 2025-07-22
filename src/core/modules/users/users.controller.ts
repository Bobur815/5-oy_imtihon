import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUpload } from 'src/common/utils/avatar.upload';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private jwtService:JwtService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all users' })
  getAllUsers() {
    return this.usersService.getAllUsers();
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