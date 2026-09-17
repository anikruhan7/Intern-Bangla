import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryStatus } from '../entities/certificate.entity';

export class UpdateCertificateDto {
  @IsOptional()
  @IsEnum(DeliveryStatus)
  deliveryStatus?: DeliveryStatus;
}
