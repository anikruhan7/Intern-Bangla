import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  Certificate,
  CertificateType,
  DeliveryStatus,
} from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepo: Repository<Certificate>,
  ) {}

  async create(dto: CreateCertificateDto): Promise<Certificate> {
    const certificate = this.certificateRepo.create({
      certificateNumber: `IB-${randomUUID().slice(0, 8).toUpperCase()}`,
      user: { id: dto.userId },
      course: dto.courseId ? { id: dto.courseId } : null,
      type: dto.type,
      deliveryAddress: dto.deliveryAddress,
      deliveryStatus:
        dto.type === CertificateType.DIGITAL ? null : DeliveryStatus.PENDING,
      issuedAt: new Date(),
    });
    return await this.certificateRepo.save(certificate);
  }

  async findMine(userId: number): Promise<Certificate[]> {
    return await this.certificateRepo.find({
      where: { user: { id: userId } },
      relations: { course: true },
      order: { issuedAt: 'DESC' },
    });
  }

  async verify(certificateNumber: string): Promise<Certificate | null> {
    return await this.certificateRepo.findOne({
      where: { certificateNumber },
      relations: { user: true, course: true },
    });
  }

  async update(id: number, dto: UpdateCertificateDto): Promise<Certificate> {
    const certificate = await this.certificateRepo.findOne({ where: { id } });
    if (!certificate) {
      throw new BadRequestException('Certificate not found');
    }
    Object.assign(certificate, dto);
    return await this.certificateRepo.save(certificate);
  }
}
