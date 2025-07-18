import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { ApiProperty } from '@nestjs/swagger';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { EVerificationTypes } from 'src/common/types/everificationtype';

@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService){}

   @ApiProperty({
    description: `Valid types:
    ${EVerificationTypes.REGISTER},
    ${EVerificationTypes.EDIT_PHONE},
    ${EVerificationTypes.RESET_PASSWORD}`
   })
   @Post('send')
   sendOtp(@Body() body: SendOtpDto){
    return this.verificationService.sendOtp(body)
   }


   @Post('verify')
   verifyOtp(@Body() body:VerifyOtpDto){
    return this.verificationService.verifyOtp(body)
   }
}
