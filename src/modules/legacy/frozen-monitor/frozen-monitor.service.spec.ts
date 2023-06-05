import { Test, TestingModule } from '@nestjs/testing';
import { FrozenMonitorService } from './frozen-monitor.service';

describe('FrozenMonitorService', () => {
  let service: FrozenMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrozenMonitorService],
    }).compile();

    service = module.get<FrozenMonitorService>(FrozenMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
