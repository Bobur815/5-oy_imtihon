import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Score given by the user',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number;

  @ApiProperty({
    description: 'User comment on the course',
    example: 'Great explanations and clear examples!',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'ID of the course being rated',
    example: '9f8b7a6c-1234-4d5e-9f8a-7b6c5d4e3f2g',
  })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}

export class UpdateRatingDto extends PartialType(CreateRatingDto) {}
