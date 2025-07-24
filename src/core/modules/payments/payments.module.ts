import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from 'src/core/database/prisma.service';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports: [
    RedisModule,
    PrismaModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService],
})
export class PaymentsModule {}
