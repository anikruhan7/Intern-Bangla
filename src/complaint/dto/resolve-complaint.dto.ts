import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ComplaintAction } from '../entities/complaint.entity';

export class ResolveComplaintDto {
  @IsEnum(ComplaintAction)
  action: ComplaintAction;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  adminNotes?: string;
}
