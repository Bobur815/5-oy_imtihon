import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength,} from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description:'User phone number',
        example:'+998901234567'
    })
    @IsNotEmpty()
    @Matches(/^\+998\d{9}$/,{
        message: 'Phone must be a valid Uzbekistan number (+998XXXXXXXXX)'
    })
    phone:string

    @ApiProperty({
        description: 'Password (minimum 6 characters)',
        example: 'strongP@ssw0rd',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password:string

    @ApiProperty({
        description: 'Full name of the user',
        example: 'Boburmirzo Ergashev',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    fullName: string;

    @ApiProperty({
        description: 'One-time password sent via SMS',
        example: '123456'
    })
    @IsString()
    @Matches(/^\d{6}$/, {
        message: 'OTP code must be 6 digits',
    })
    otpCode: string;
}
