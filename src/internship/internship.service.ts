import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Internship } from './entities/internship.entity';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { User, UserRole } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';

const SUMMARY_SELECT = {
  id: true,
  title: true,
  description: true,
  requirements: true,
  isActive: true,
  createdAt: true,
  company: {
    id: true,
    name: true,
  },
} as const;

@Injectable()
export class InternshipService {
  constructor(
    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Resolves which company an internship-management action should apply to.
   * HR always acts on their own company - the client can't choose one for
   * them. ADMIN may act on any company, but must say which via companyId.
   */
  private async resolveCompanyId(
    actingUser: User,
    requestedCompanyId?: number,
  ): Promise<number> {
    if (actingUser.role === UserRole.ADMIN) {
      if (!requestedCompanyId) {
        throw new BadRequestException(
          'companyId is required when an admin posts on behalf of a company',
        );
      }
      return requestedCompanyId;
    }

    const companyId = await this.usersService.getCompanyIdForUser(
      actingUser.id,
    );
    if (!companyId) {
      throw new ForbiddenException(
        'Your account is not linked to a company yet',
      );
    }
    return companyId;
  }

  async createInternship(
    dto: CreateInternshipDto,
    actingUser: User,
  ): Promise<Internship> {
    const companyId = await this.resolveCompanyId(actingUser, dto.companyId);
    const internship = this.internshipRepo.create({
      title: dto.title,
      description: dto.description,
      requirements: dto.requirements,
      company: { id: companyId },
    });
    return await this.internshipRepo.save(internship);
  }

  async getAllInternships(): Promise<Internship[]> {
    return await this.internshipRepo.find({
      where: { isActive: true },
      relations: { company: true },
      select: SUMMARY_SELECT,
      order: { createdAt: 'DESC' },
    });
  }

  async getInternshipsForCompany(companyId: number): Promise<Internship[]> {
    return await this.internshipRepo.find({
      where: { company: { id: companyId } },
      relations: { company: true },
      select: SUMMARY_SELECT,
      order: { createdAt: 'DESC' },
    });
  }

  async getInternshipsMine(actingUser: User, requestedCompanyId?: number) {
    const companyId = await this.resolveCompanyId(
      actingUser,
      requestedCompanyId,
    );
    return this.getInternshipsForCompany(companyId);
  }

  async getInternshipById(id: number): Promise<Internship | null> {
    const internship = await this.internshipRepo.findOne({
      where: {
        id: id,
      },
      relations: { company: true },
      select: SUMMARY_SELECT,
    });

    return internship;
  }

  /** Throws if the acting HR user doesn't own the internship's company. Admins pass through. */
  private async assertCanManage(
    internship: Internship,
    actingUser: User,
  ): Promise<void> {
    if (actingUser.role === UserRole.ADMIN) return;
    const companyId = await this.usersService.getCompanyIdForUser(
      actingUser.id,
    );
    if (!companyId || internship.company.id !== companyId) {
      throw new ForbiddenException(
        "You can only manage your own company's internships",
      );
    }
  }

  async updateInternship(
    id: number,
    updateInternshipDto: UpdateInternshipDto,
    actingUser: User,
  ): Promise<Internship> {
    const internship = await this.getInternshipById(id);
    if (!internship) {
      throw new BadRequestException('internship not Found');
    }
    await this.assertCanManage(internship, actingUser);
    // companyId is intentionally never applied from the DTO here - an
    // internship can't be reassigned to a different company via update.
    if (updateInternshipDto.title !== undefined)
      internship.title = updateInternshipDto.title;
    if (updateInternshipDto.description !== undefined)
      internship.description = updateInternshipDto.description;
    if (updateInternshipDto.requirements !== undefined)
      internship.requirements = updateInternshipDto.requirements;
    if (updateInternshipDto.isActive !== undefined)
      internship.isActive = updateInternshipDto.isActive;
    return await this.internshipRepo.save(internship);
  }

  async deleteInternship(id: number, actingUser: User): Promise<string> {
    const internship = await this.getInternshipById(id);
    if (!internship) {
      return `internship not found`;
    }
    await this.assertCanManage(internship, actingUser);
    await this.internshipRepo.delete(id);
    return `internship deleted with id ${id}`;
  }
}
