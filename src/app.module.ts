import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './core/users/users.module';
import { MentorProfileModule } from './core/mentor-profile/mentor-profile.module';
import { AuthModule } from './core/auth/auth.module';
import { RedisModule } from './common/redis/redis.module';
import { VerificationModule } from './core/verification/verification.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    MentorProfileModule,
    AuthModule,
    RedisModule,
    VerificationModule,
    ConfigModule.forRoot({
      isGlobal:true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
