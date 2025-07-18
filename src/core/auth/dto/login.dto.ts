import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginDto{
    @ApiProperty({
        description:'User phone number',
        example:'+998901234567'
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\+998\d{9}$/, {
        message: 'Phone must be a valid Uzbekistan number (+998XXXXXXXXX)',
    })
    phone: string;

    @ApiProperty({
        description: 'Password (minimum 6 characters)',
        example: 'strongP@ssw0rd',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}