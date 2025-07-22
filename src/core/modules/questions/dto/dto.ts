import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {

  @ApiProperty({ description: 'ID of the course' })
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'The question text' })
  @IsString()
  @MinLength(1)
  text: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
