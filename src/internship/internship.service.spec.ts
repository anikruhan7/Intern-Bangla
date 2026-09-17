import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternshipService } from './internship.service';
import { Internship } from './entities/internship.entity';

describe('InternshipService', () => {
  let service: InternshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternshipService,
        { provide: getRepositoryToken(Internship), useValue: {} },
      ],
    }).compile();

    service = module.get<InternshipService>(InternshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
