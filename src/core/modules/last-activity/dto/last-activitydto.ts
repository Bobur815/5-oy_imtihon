import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateLastActivityDto {
  @ApiProperty({ description: 'ID of the user', example: 123 })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'ID of the course', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'ID of the module', example: 7 })
  @IsInt()
  moduleId: number;

  @ApiProperty({ description: 'ID of the lesson', example: 'l9m8n7o6-p5q4-3210-rstu-vw9876543210' })
  @IsString()
  lessonId: string;

  @ApiProperty({ description: 'Optional URL visited in this activity', example: 'https://example.com/lesson/1', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;
}

export class UpdateLastActivityDto extends PartialType(CreateLastActivityDto) {}
