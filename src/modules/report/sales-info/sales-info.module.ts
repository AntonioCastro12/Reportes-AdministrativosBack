import { CacheModule, Module } from '@nestjs/common';
import { SalesInfoController } from './sales-info.controller';
import { SalesInfoService } from './sales-info.service';

@Module({
  imports: [CacheModule.registerAsync({
      useFactory: () => ({
    ttl: 0,
      }),
      }),],
  controllers: [SalesInfoController],
  providers: [SalesInfoService]
})
export class SalesInfoModule {}
