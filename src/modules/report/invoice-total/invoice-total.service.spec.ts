import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceTotalService } from './invoice-total.service';

describe('InvoiceTotalService', () => {
  let service: InvoiceTotalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceTotalService],
    }).compile();

    service = module.get<InvoiceTotalService>(InvoiceTotalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
