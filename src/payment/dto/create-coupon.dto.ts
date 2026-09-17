import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsInt()
  @Min(1)
  @Max(100)
  discountPercent: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
