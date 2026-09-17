import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampusAmbassador } from './entities/campus-ambassador.entity';
import { CreateCampusAmbassadorDto } from './dto/create-campus-ambassador.dto';
import { UpdateCampusAmbassadorDto } from './dto/update-campus-ambassador.dto';

@Injectable()
export class CampusAmbassadorService {
  constructor(
    @InjectRepository(CampusAmbassador)
    private readonly repo: Repository<CampusAmbassador>,
  ) {}

  async create(dto: CreateCampusAmbassadorDto): Promise<CampusAmbassador> {
    const application = this.repo.create(dto);
    return await this.repo.save(application);
  }

  async findAll(): Promise<CampusAmbassador[]> {
    return await this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async update(
    id: number,
    dto: UpdateCampusAmbassadorDto,
  ): Promise<CampusAmbassador> {
    const application = await this.repo.findOne({ where: { id } });
    if (!application) {
      throw new BadRequestException('Application not found');
    }
    Object.assign(application, dto);
    return await this.repo.save(application);
  }
}
