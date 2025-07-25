import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { EVerificationTypes, ICheckOtp } from 'src/common/types/everificationtype';
import { RedisService } from 'src/common/redis/redis.service';
import { PrismaService } from 'src/core/database/prisma.service';
import { generateOtp } from 'src/common/utils/generateOtp';
import { SmsService } from 'src/common/services/sms.service';

@Injectable()
export class VerificationService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly smsService: SmsService,
        private readonly redis: RedisService
    ){}

    public getKey(type: EVerificationTypes, phone: string, confirmation?:boolean){
        const storeKeys: Record<EVerificationTypes, string> = {
            [EVerificationTypes.REGISTER]: 'reg_',
            [EVerificationTypes.EDIT_PHONE]: 'edph_',
            [EVerificationTypes.RESET_PASSWORD]: 'respass_',
        };

        let key = storeKeys[type]
        if(confirmation){
            key += 'cfm_'
        }

        key += phone
        return key
    }
    private getMessage(type: EVerificationTypes, otp: string){
        switch (type){
            case EVerificationTypes.REGISTER:
                return `Fixoo platformasidan ro'yxatdan o'tish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`
            case EVerificationTypes.RESET_PASSWORD:
                return `O'quv platformasida parolingizni tiklash uchun kod: ${otp}. Kodni hech kimga bermang`
            case EVerificationTypes.EDIT_PHONE:
                return `O'quv platformasid telefon raqamingizni almashtirish uchun kod: ${otp}. Kodni hech kimga bermang`
        }
    }

    private async throwIfUserExists (phone: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                phone: phone
            }
        })
        // if(user){
        //     throw new HttpException('Phone already used',HttpStatus.BAD_REQUEST)
        // }
        return user
    }

    private async throwIfUserNotExists (phone: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                phone
            }
        })
        if(!user){
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async sendOtp(payload:SendOtpDto){
        const {type, phone} = payload
        const key = this.getKey(type, phone)
        const session = await this.redis.get(key)

        // if(session){
        //     throw new HttpException('Code already sent to user', HttpStatus.BAD_REQUEST)
        // }

        switch(type) {
            case EVerificationTypes.REGISTER:
                await this.throwIfUserExists(phone)
                break
            case EVerificationTypes.RESET_PASSWORD:
                await this.throwIfUserNotExists(phone)
                break
            case EVerificationTypes.EDIT_PHONE:
                await this.throwIfUserNotExists(phone)
                break
        }

        const otp = generateOtp();
        await this.redis.set(key, JSON.stringify(otp), 600);
        
        await this.smsService.sendSMS(this.getMessage(type, otp), phone)
        return { message: 'Confirmation code sent'}
    }

    async verifyOtp(payload:VerifyOtpDto){
        const {type, phone, otpCode} = payload
        const session = await this.redis.get(this.getKey(type, phone))

        if(!session){
            throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST)
        }

        if (otpCode !== JSON.parse(session)){
            throw new HttpException('Invalid OTP!', HttpStatus.BAD_REQUEST)
        }

        await this.redis.del(this.getKey(type, phone));
        await this.redis.set(
            this.getKey(type, phone, true),
            JSON.stringify(otpCode),
            600
        );

        return {
            success:true,
            message: 'Verification successfull'
        }
    }

    public async checkConfirmOtp(payload: ICheckOtp){
        const { type, phone, otp} = payload
        const session = await this.redis.get(this.getKey(type, phone, true))

        if(!session){
            throw new HttpException('OTP expired or incorrect data!', HttpStatus.BAD_REQUEST)
        }

        if (otp !== JSON.parse(session)){
            throw new HttpException('Invalid OTP!', HttpStatus.BAD_REQUEST)
        }

        await this.redis.del(this.getKey(type, phone, true))
        return true
    }
}
