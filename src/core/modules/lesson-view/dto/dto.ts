import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateLessonViewDto {
  @ApiProperty({
    description: 'ID of the lesson being viewed',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsString()
  lessonId: string;

  @ApiProperty({
    description: 'Whether the lesson has been viewed',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  view?: boolean;
}

export class UpdateLessonViewDto extends PartialType(CreateLessonViewDto) {}
