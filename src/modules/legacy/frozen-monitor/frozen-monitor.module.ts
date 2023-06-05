import { CacheModule, Module } from '@nestjs/common';
import { FrozenMonitorController } from './frozen-monitor.controller';
import { FrozenMonitorService } from './frozen-monitor.service';

@Module({
  imports: [CacheModule.registerAsync({
      useFactory: () => ({
    ttl: 0,
      }),
      }),],
  controllers: [FrozenMonitorController],
  providers: [FrozenMonitorService]
})
export class FrozenMonitorModule {}
