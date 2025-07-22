import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateHomeWorkDto {
    @ApiProperty({
        description:"Detailed task for homework"
    })
    @IsNotEmpty()
    task:string;

    @ApiProperty({
        description:"ID of a lesson"
    })
    @IsNotEmpty()
    lessonId:string
}

export class UpdateHomeWorkDto extends PartialType(CreateHomeWorkDto){}
