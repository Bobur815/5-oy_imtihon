import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/common/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessOptions, JwtRefreshOptions } from 'src/common/jwt/jwt.config';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [
    ConfigModule,                  
    PrismaModule,                  
    RedisModule,  
    VerificationModule,                
    JwtModule.register(JwtAccessOptions),  
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'JWT_REFRESH_OPTIONS',
      useValue: JwtRefreshOptions,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}