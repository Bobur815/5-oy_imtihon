import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class HomeworkSubmissionDto {
    @IsNotEmpty()
    @Type(() => Number)
    homeworkId:number

    @IsOptional()
    text?:string

    @IsOptional()
    reason?:string
}

export class UpdateHomeworkSubmissionDto extends PartialType(HomeworkSubmissionDto){}
