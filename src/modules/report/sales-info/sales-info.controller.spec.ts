import { Test, TestingModule } from '@nestjs/testing';
import { SalesInfoController } from './sales-info.controller';

describe('SalesInfoController', () => {
  let controller: SalesInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesInfoController],
    }).compile();

    controller = module.get<SalesInfoController>(SalesInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
