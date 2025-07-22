import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsUrl, IsInt, Min } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ description: 'Unique name/title of the lesson' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Detailed description of the lesson' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ description: 'ID of the parent lesson module', example: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  moduleId: number;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}