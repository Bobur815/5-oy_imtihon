import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { PaidVia } from '@prisma/client';
import { Type } from 'class-transformer';

export class PurchasedCourseDto {
  @ApiProperty({
    description: 'Identifier of the course being purchased',
    example: '9f8b7a6c-1234-4d5e-9f8a-7b6c5d4e3f2g',
  })
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Numeric ID of the user who purchased the course',
    example: 42,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: 'Amount paid for the course',
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaidVia,
    example: PaidVia.CLICK,
  })
  @IsNotEmpty()
  @IsEnum(PaidVia)
  paidVia: PaidVia;
}

export class UpdatePurchasedCourseDto extends PartialType(PurchasedCourseDto) {}
