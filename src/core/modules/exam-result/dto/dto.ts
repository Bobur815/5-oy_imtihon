import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsBoolean, Min } from 'class-validator';

export class CreateExamResultDto {
  @ApiProperty({ description: 'ID of the lesson module' })
  @IsInt()
  lessonModuleId: number;

  @ApiProperty({ description: 'Whether the user passed the exam' })
  @IsBoolean()
  passed: boolean;

  @ApiProperty({ description: 'Number of correct answers', minimum: 0 })
  @IsInt()
  @Min(0)
  corrects: number;

  @ApiProperty({ description: 'Number of wrong answers', minimum: 0 })
  @IsInt()
  @Min(0)
  wrongs: number;
}

export class UpdateExamResultDto extends PartialType(CreateExamResultDto) {}
