import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';

describe('ResumeService', () => {
  let service: ResumeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: getRepositoryToken(Resume), useValue: {} },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
