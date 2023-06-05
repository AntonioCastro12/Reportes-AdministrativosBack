import { Test, TestingModule } from '@nestjs/testing';
import { SalesInfoService } from './sales-info.service';

describe('SalesInfoService', () => {
  let service: SalesInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesInfoService],
    }).compile();

    service = module.get<SalesInfoService>(SalesInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
