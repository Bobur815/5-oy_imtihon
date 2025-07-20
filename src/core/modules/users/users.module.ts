import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/core/database/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAccessOptions } from 'src/common/jwt/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/utils/jwt-strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports:[
    PrismaModule,
    PassportModule.register({         
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register(JwtAccessOptions)
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,   
    },
  ],
  exports:[UsersService]
})
export class UsersModule {}
