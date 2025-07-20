import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { CourseLevel } from "src/common/types/course-level";

export class CourseDto {
    @ApiProperty({
        description: 'Course name',
        example: 'JS basics'
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: 'About course',
        example: 'This course teaches basics of Javascript'
    })
    @IsNotEmpty()
    about: string

    @ApiProperty({
        description: 'Price of a course',
        example: '$19.99'
    })
    @Type(() => Number)
    @IsNumber()
    price: number

    @ApiProperty({
        description: 'level of a course',
        example: 'Beginner'
    })
    @IsNotEmpty()
    level: CourseLevel

    @ApiProperty({
        description: 'Course published',
        example: 'true',
        default: 'false'
    })
    @IsBoolean()
    @IsOptional()
    published: boolean

    @ApiProperty({
        description: 'Category id of a course',
    })
    @Type(() => Number)
    @IsNumber()
    categoryId: number
}
