import { CacheModule, Module } from '@nestjs/common';
import { TransactionMonitorController } from './transaction-monitor.controller';
import { TransactionMonitorService } from './transaction-monitor.service';

@Module({
  imports: [CacheModule.registerAsync({
      useFactory: () => ({
    ttl: 0,
      }),
      }),],
  controllers: [TransactionMonitorController],
  providers: [TransactionMonitorService]
})
export class TransactionMonitorModule {}
