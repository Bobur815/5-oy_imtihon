import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty({ description: 'ID of the question being answered' })
  @IsInt()
  questionId: number;

  @ApiProperty({ description: 'The answer text' })
  @IsString()
  @MinLength(1)
  text: string;
}

export class UpdateQuestionAnswerDto extends PartialType(CreateQuestionAnswerDto) {}
