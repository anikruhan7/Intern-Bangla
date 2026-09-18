import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateInternshipDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  requirements: string;

  // Only read for ADMIN callers (who post on a company's behalf) - an HR
  // caller's own company is always used instead, never trusted from the
  // client. See InternshipService.createInternship.
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  companyId?: number;
}
