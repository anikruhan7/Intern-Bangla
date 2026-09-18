import { Module } from '@nestjs/common';
import { TommyController } from './tommy.controller';
import { TommyService } from './tommy.service';

@Module({
  controllers: [TommyController],
  providers: [TommyService],
})
export class TommyModule {}
