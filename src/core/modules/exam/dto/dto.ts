import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ExamAnswer } from '@prisma/client';
import { IsString, IsEnum, IsInt, MinLength, } from 'class-validator';



export class CreateExamDto {
  @ApiProperty({ description: 'The question text' })
  @IsString()
  @MinLength(5)
  question: string;

  @ApiProperty({ description: 'Option A' })
  @IsString()
  optionA: string;

  @ApiProperty({ description: 'Option B' })
  @IsString()
  optionB: string;

  @ApiProperty({ description: 'Option C' })
  @IsString()
  optionC: string;

  @ApiProperty({ description: 'Option D' })
  @IsString()
  optionD: string;

  @ApiProperty({ enum: ExamAnswer, description: 'Correct answer key' })
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;

  @ApiProperty({ description: 'Foreign key to LessonModule' })
  @IsInt()
  lessonModuleId: number;
}

export class UpdateExamDto extends PartialType(CreateExamDto) {}
