import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export class UserFilterDto {
    @ApiPropertyOptional({
        enum: Role,
        example: Role.STUDENT,
    })
    @IsOptional()
    @IsEnum(Role)
    @Type(() => String)
    role?: Role

    @ApiPropertyOptional({
        description: 'Total years of professional experience',
        example: 5,
    })
    @IsOptional()
    @Type(() => Number)
    experience?: number

    @ApiPropertyOptional({
        description: 'Full name of the user',
        example: 'Bobur Mirzo',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullName?: string;
}