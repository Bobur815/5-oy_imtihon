import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMobilePhone, IsNotEmpty, IsString, Matches } from "class-validator";
import { EVerificationTypes } from "src/common/types/everificationtype";

export class SendOtpDto{

    @ApiProperty({
        enum: EVerificationTypes
    })
    @IsNotEmpty()
    @IsEnum(EVerificationTypes)
    type:EVerificationTypes

    @ApiProperty({
        description:'User phone number',
        example:'+998901234567'
    })
    @IsNotEmpty()
    @IsMobilePhone('uz-UZ')
    @Matches(/^\+998\d{9}$/, {
        message: 'Phone must be a valid Uzbekistan number (+998XXXXXXXXX)',
    })
    phone: string;
}

export class VerifyOtpDto extends SendOtpDto{
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