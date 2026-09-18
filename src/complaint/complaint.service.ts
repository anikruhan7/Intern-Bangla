import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Complaint,
  ComplaintAction,
  ComplaintStatus,
} from './entities/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ResolveComplaintDto } from './dto/resolve-complaint.dto';
import { User, BanStatus } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepo: Repository<Complaint>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreateComplaintDto, reporterId: number): Promise<Complaint> {
    if (!dto.reportedUserId && !dto.reportedCompanyId) {
      throw new BadRequestException(
        'You must specify either a user or a company to report',
      );
    }
    if (dto.reportedUserId && dto.reportedCompanyId) {
      throw new BadRequestException(
        'A complaint can only target a user OR a company, not both',
      );
    }
    if (dto.reportedUserId === reporterId) {
      throw new BadRequestException('You cannot report yourself');
    }

    const complaint = this.complaintRepo.create({
      category: dto.category,
      description: dto.description,
      reporter: { id: reporterId },
      reportedUser: dto.reportedUserId ? { id: dto.reportedUserId } : null,
      reportedCompany: dto.reportedCompanyId
        ? { id: dto.reportedCompanyId }
        : null,
    });

    return await this.complaintRepo.save(complaint);
  }

  async findAll(): Promise<Complaint[]> {
    return await this.complaintRepo.find({
      relations: { reporter: true, reportedUser: true, reportedCompany: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findMine(reporterId: number): Promise<Complaint[]> {
    return await this.complaintRepo.find({
      where: { reporter: { id: reporterId } },
      relations: { reportedUser: true, reportedCompany: true },
      order: { createdAt: 'DESC' },
    });
  }

  async resolve(id: number, dto: ResolveComplaintDto): Promise<Complaint> {
    const complaint = await this.complaintRepo.findOne({
      where: { id },
      relations: { reportedUser: true, reportedCompany: true },
    });
    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    if (dto.action === ComplaintAction.WARNING || dto.action === ComplaintAction.BAN) {
      const reason = dto.adminNotes || `Action taken on complaint #${id}`;
      const banStatus =
        dto.action === ComplaintAction.BAN ? BanStatus.BANNED : BanStatus.WARNED;

      if (complaint.reportedUser) {
        await this.userRepo.update(complaint.reportedUser.id, {
          banStatus,
          banReason: reason,
          ...(banStatus === BanStatus.BANNED ? { hashedRefreshToken: null } : {}),
        });
      } else if (complaint.reportedCompany) {
        // A company has no login of its own - action applies to every HR
        // account representing it, and hides the company from public view.
        const hrUsers = await this.userRepo.find({
          where: { company: { id: complaint.reportedCompany.id } },
        });
        for (const hr of hrUsers) {
          await this.userRepo.update(hr.id, {
            banStatus,
            banReason: reason,
            ...(banStatus === BanStatus.BANNED ? { hashedRefreshToken: null } : {}),
          });
        }
        if (dto.action === ComplaintAction.BAN) {
          await this.companyRepo.update(complaint.reportedCompany.id, {
            banned: true,
            isVerified: false,
          });
        }
      }
    }

    complaint.status = ComplaintStatus.REVIEWED;
    complaint.adminAction = dto.action;
    complaint.adminNotes = dto.adminNotes ?? null;
    return await this.complaintRepo.save(complaint);
  }

  async dismiss(id: number, adminNotes?: string): Promise<Complaint> {
    const complaint = await this.complaintRepo.findOne({ where: { id } });
    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }
    complaint.status = ComplaintStatus.DISMISSED;
    complaint.adminAction = ComplaintAction.NONE;
    complaint.adminNotes = adminNotes ?? null;
    return await this.complaintRepo.save(complaint);
  }
}
