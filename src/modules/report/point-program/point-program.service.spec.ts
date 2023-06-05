import { Test, TestingModule } from '@nestjs/testing';
import { PointProgramService } from './point-program.service';

describe('PointProgramService', () => {
  let service: PointProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointProgramService],
    }).compile();

    service = module.get<PointProgramService>(PointProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
