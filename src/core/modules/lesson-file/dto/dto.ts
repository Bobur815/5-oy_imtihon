import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateLessonFileDto {

  @ApiProperty({
    description: 'A brief note or description for the video file',
    example: 'Lecture slides for Chapter 1',
  })
  @IsString()
  note: string;

  @ApiProperty({
    description: 'The ID of the lesson this file belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsString()
  lessonId: string;
}

export class UpdateLessonFileDto extends PartialType(CreateLessonFileDto) {}
