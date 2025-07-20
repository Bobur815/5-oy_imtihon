import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/common/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessOptions, JwtRefreshOptions } from 'src/common/jwt/jwt.config';
import { VerificationModule } from '../verification/verification.module';
import { JwtStrategy } from 'src/common/utils/jwt-strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,                  
    PrismaModule,                  
    RedisModule,  
    VerificationModule,  
    UsersModule, 
    PassportModule.register({           
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register(JwtAccessOptions),  
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: 'JWT_REFRESH_OPTIONS',
      useValue: JwtRefreshOptions,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}