import { CacheModule, Module } from '@nestjs/common';
import { ShippingListController } from './shipping-list.controller';
import { ShippingListService } from './shipping-list.service';

@Module({
  imports: [CacheModule.registerAsync({
      useFactory: () => ({
    ttl: 0,
      }),
      }),],
  controllers: [ShippingListController],
  providers: [ShippingListService]
})
export class ShippingListModule {}
