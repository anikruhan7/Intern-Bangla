import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, User, Company])],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
