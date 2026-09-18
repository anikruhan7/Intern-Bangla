import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComplaintCategory } from '../entities/complaint.entity';

export class CreateComplaintDto {
  @IsEnum(ComplaintCategory)
  category: ComplaintCategory;

  @IsString()
  @MinLength(20, { message: 'Please describe the issue in at least 20 characters' })
  @MaxLength(2000)
  description: string;

  @ValidateIf((dto: CreateComplaintDto) => !dto.reportedCompanyId)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  reportedUserId?: number;

  @ValidateIf((dto: CreateComplaintDto) => !dto.reportedUserId)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  reportedCompanyId?: number;
}
