import { Test, TestingModule } from '@nestjs/testing';
import { FrozenMonitorController } from './frozen-monitor.controller';

describe('FrozenMonitorController', () => {
  let controller: FrozenMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrozenMonitorController],
    }).compile();

    controller = module.get<FrozenMonitorController>(FrozenMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
