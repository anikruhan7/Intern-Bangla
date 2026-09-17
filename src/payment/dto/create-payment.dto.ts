import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  courseId: number;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
