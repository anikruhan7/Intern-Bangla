import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusAmbassadorService } from './campus-ambassador.service';
import { CampusAmbassadorController } from './campus-ambassador.controller';
import { CampusAmbassador } from './entities/campus-ambassador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CampusAmbassador])],
  controllers: [CampusAmbassadorController],
  providers: [CampusAmbassadorService],
  exports: [CampusAmbassadorService],
})
export class CampusAmbassadorModule {}
