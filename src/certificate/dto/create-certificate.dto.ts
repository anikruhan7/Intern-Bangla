import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CertificateType } from '../entities/certificate.entity';

export class CreateCertificateDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  courseId?: number;

  @IsEnum(CertificateType)
  type: CertificateType;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;
}
