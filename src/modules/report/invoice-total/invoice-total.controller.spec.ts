import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceTotalController } from './invoice-total.controller';

describe('InvoiceTotalController', () => {
  let controller: InvoiceTotalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceTotalController],
    }).compile();

    controller = module.get<InvoiceTotalController>(InvoiceTotalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
