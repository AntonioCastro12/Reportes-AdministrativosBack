import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMonitorService } from './transaction-monitor.service';

describe('TransactionMonitorService', () => {
  let service: TransactionMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionMonitorService],
    }).compile();

    service = module.get<TransactionMonitorService>(TransactionMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
