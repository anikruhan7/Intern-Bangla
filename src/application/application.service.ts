import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeService } from '../resume/resume.service';
import { InternshipService } from '../internship/internship.service';
import { UsersService } from '../user/users.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationType } from '../common/enums/application-type.enum';
import { User, UserRole } from '../user/entities/user.entity';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { UpdateApplicationDto } from './dto/update-application.dto';

const DETAIL_RELATIONS = {
  student: true,
  internship: { company: true },
  resume: true,
  referredBy: true,
} as const;

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    private readonly resumeService: ResumeService,
    private readonly internshipService: InternshipService,
    private readonly userService: UsersService,
  ) {}

  async createApplication(
    dto: CreateApplicationDto,
    studentId: number,
  ): Promise<Application> {
    const student = await this.userService.findOne(studentId);

    const internship = await this.internshipService.getInternshipById(
      dto.internshipId,
    );

    if (!internship) {
      throw new NotFoundException(
        `Internship with id ${dto.internshipId} not found`,
      );
    }

    if (!internship.isActive) {
      throw new BadRequestException('This internship is not Active Right Now!');
    }

    const resume = await this.resumeService.getResumeById(dto.resumeId);

    if (!resume) {
      throw new NotFoundException(`Resume with id ${dto.resumeId} not found`);
    }

    if (resume.student.id !== studentId) {
      throw new ForbiddenException('This is not your Resume!');
    }

    const existingApplication = await this.applicationRepo.findOne({
      where: {
        student: {
          id: studentId,
        },
        internship: {
          id: dto.internshipId,
        },
      },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'You have already applied in this internship circular!',
      );
    }

    let referredBy: User | null = null;

    if (dto.type === ApplicationType.REFERRAL) {
      if (!dto.referredById) {
        throw new BadRequestException(
          'Referral application-এ Alumni id দিতে হবে!',
        );
      }

      referredBy = await this.userService.findOne(dto.referredById);

      if (referredBy.role !== UserRole.ALUMNI) {
        throw new BadRequestException('Referrer must be an Alumni');
      }
    }

    if (dto.type === ApplicationType.DIRECT && dto.referredById) {
      throw new BadRequestException(
        'Direct application Will not contain Referrel ID',
      );
    }

    const application = this.applicationRepo.create({
      student,
      internship,
      resume,
      referredBy,
      type: dto.type,
      status: ApplicationStatus.PENDING,
    });

    return await this.applicationRepo.save(application);
  }

  /** HR sees only applications to their own company's internships; admin sees all. */
  async findAllApplications(actingUser: User): Promise<Application[]> {
    if (actingUser.role === UserRole.ADMIN) {
      return await this.applicationRepo.find({
        relations: DETAIL_RELATIONS,
        order: { createdAt: 'DESC' },
      });
    }

    const companyId = await this.userService.getCompanyIdForUser(actingUser.id);
    if (!companyId) {
      return [];
    }
    return await this.applicationRepo.find({
      where: { internship: { company: { id: companyId } } },
      relations: DETAIL_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async findMineForStudent(studentId: number): Promise<Application[]> {
    return await this.applicationRepo.find({
      where: { student: { id: studentId } },
      relations: DETAIL_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Application> {
    const application = await this.applicationRepo.findOne({
      where: {
        id,
      },
      relations: DETAIL_RELATIONS,
    });

    if (!application) {
      throw new NotFoundException(`Application with ${id} not found`);
    }
    return application;
  }

  /** Student who owns it, HR from the owning company, or admin. */
  async findByIdForViewer(id: number, viewer: User): Promise<Application> {
    const application = await this.findById(id);
    if (viewer.role === UserRole.ADMIN) return application;
    if (application.student.id === viewer.id) return application;
    if (viewer.role === UserRole.HR) {
      const companyId = await this.userService.getCompanyIdForUser(viewer.id);
      if (companyId && application.internship.company.id === companyId) {
        return application;
      }
    }
    throw new ForbiddenException('You cannot view this application');
  }

  async updateStatus(
    dto: UpdateApplicationDto,
    id: number,
    actingUser: User,
  ): Promise<Application> {
    const application = await this.findById(id);

    if (actingUser.role !== UserRole.ADMIN) {
      const companyId = await this.userService.getCompanyIdForUser(
        actingUser.id,
      );
      if (!companyId || application.internship.company.id !== companyId) {
        throw new ForbiddenException(
          "You can only review applications to your own company's internships",
        );
      }
    }

    application.status = dto.status;
    return await this.applicationRepo.save(application);
  }

  async removeApplication(
    id: number,
    studentId: number,
  ): Promise<{ message: string }> {
    const application = await this.findById(id);

    if (application.student.id !== studentId) {
      throw new ForbiddenException('You can not delete this application');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Only Pending Application Can Withdrow!');
    }

    await this.applicationRepo.delete(id);

    return {
      message: `Application ${id} withdrawn successfully`,
    };
  }
}
