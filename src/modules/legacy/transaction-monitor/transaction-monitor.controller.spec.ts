import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMonitorController } from './transaction-monitor.controller';

describe('TransactionMonitorController', () => {
  let controller: TransactionMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionMonitorController],
    }).compile();

    controller = module.get<TransactionMonitorController>(TransactionMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
