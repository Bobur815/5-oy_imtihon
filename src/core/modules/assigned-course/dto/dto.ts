import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssignedCourseDto {
  @ApiProperty({
    description: 'Numeric ID of the user to whom the course will be assigned',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Identifier of the course to assign (could be UUID or numeric string)',
    example: '9f8b7a6c-1234-4d5e-9f8a-7b6c5d4e3f2g',
  })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}


export class UpdateAssignedCourseDto extends PartialType(AssignedCourseDto){}
