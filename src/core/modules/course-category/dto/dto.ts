import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CourseCategoryDto {
    @ApiProperty({
        description:'Course category',
        example: "Dasturlash"
    })
    @IsNotEmpty()
    name: string
}
