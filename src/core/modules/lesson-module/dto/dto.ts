import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateLessonModuleDto {
  @ApiProperty({ description: 'Title of the module' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Position/order within the course', example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'Identifier of the parent course', type: String })
  @IsString()
  courseId: string;
}

export class UpdateLessonModuleDto extends PartialType(CreateLessonModuleDto) {}