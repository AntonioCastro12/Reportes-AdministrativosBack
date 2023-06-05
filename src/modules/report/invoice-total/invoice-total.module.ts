import { CacheModule, Module } from '@nestjs/common';
import { InvoiceTotalController } from './invoice-total.controller';
import { InvoiceTotalService } from './invoice-total.service';

@Module({
  imports: [CacheModule.registerAsync({
      useFactory: () => ({
    ttl: 0,
      }),
      }),],
  controllers: [InvoiceTotalController],
  providers: [InvoiceTotalService]
})
export class InvoiceTotalModule {}
