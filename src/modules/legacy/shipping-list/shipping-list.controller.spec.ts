import { Test, TestingModule } from '@nestjs/testing';
import { ShippingListController } from './shipping-list.controller';

describe('ShippingListController', () => {
  let controller: ShippingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingListController],
    }).compile();

    controller = module.get<ShippingListController>(ShippingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
