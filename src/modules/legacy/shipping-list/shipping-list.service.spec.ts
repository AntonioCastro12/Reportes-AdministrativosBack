import { Test, TestingModule } from '@nestjs/testing';
import { ShippingListService } from './shipping-list.service';

describe('ShippingListService', () => {
  let service: ShippingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingListService],
    }).compile();

    service = module.get<ShippingListService>(ShippingListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
