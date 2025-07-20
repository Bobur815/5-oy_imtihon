import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserRole } from 'src/common/types/user-role';
import { RedisService } from 'src/common/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { VerificationService } from '../verification/verification.service';
import { EVerificationTypes } from 'src/common/types/everificationtype';
import { JwtPayload } from 'src/common/utils/jwt-payload';


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly config: ConfigService,

        protected readonly verificationService: VerificationService,

        @Inject('JWT_REFRESH_OPTIONS')
        private readonly refreshOpts: JwtSignOptions,
    ) { }

    private signAccessToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    private signRefreshToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload, this.refreshOpts);
    }

    async generateTokens(phone: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const user = await this.prisma.user.findFirst({ where: { phone } });
        if (!user) {
            throw new NotFoundException(`User with phone ${phone} not found`);
        }

        const payload: JwtPayload = {
            id: user.id,
            phone: user.phone,
            role: user.role,
        };

        const accessToken = await this.signAccessToken(payload);
        const refreshToken = await this.signRefreshToken(payload);

        const ttl = this.config.get<number>(
            'JWT_REFRESH_TTL_SECONDS',
            7 * 24 * 3600,
        );
        await this.redisService
            .getClient()
            .set(`refresh_token:${user.id}`, refreshToken, 'EX', ttl);

        return { accessToken, refreshToken };
    }

    async register(payload: RegisterDto) {
        // await this.verificationService.checkConfirmOtp({
        //     type:  EVerificationTypes.REGISTER,
        //     phone: payload.phone,
        //     otp:   payload.otpCode,     
        // });

        const hash_password = await bcrypt.hash(payload.password, 10)
        await this.prisma.user.create({
            data: {
                phone:payload.phone,
                fullName:payload.fullName,
                password: hash_password
            }
        })

        return await this.generateTokens(payload.phone)
    }

    async login(payload: LoginDto) {
        const user = await this.prisma.user.findFirst({
            where:{phone:payload.phone}
        })

        if(!user){
            throw new NotFoundException(`User with phone ${payload.phone} not found`)
        }
        console.log(user.password);
        
        const isMatch = await bcrypt.compare(payload.password,user.password)
        if(!isMatch){
            throw new ConflictException("Incorrect password")
        }

        return this.generateTokens(user.phone)
    }



}
