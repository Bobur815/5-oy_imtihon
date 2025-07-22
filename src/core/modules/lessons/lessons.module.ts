import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [LessonsController],
  providers: [LessonsService], 
  exports:[LessonsService]
})
export class LessonsModule {}
