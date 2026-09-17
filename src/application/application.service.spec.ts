import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';
import { ResumeService } from '../resume/resume.service';
import { InternshipService } from '../internship/internship.service';
import { UsersService } from '../user/users.service';

describe('ApplicationService', () => {
  let service: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        { provide: getRepositoryToken(Application), useValue: {} },
        { provide: ResumeService, useValue: {} },
        { provide: InternshipService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
