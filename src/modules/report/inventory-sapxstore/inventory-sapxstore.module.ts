import { CacheModule, Module } from '@nestjs/common';
import { InventorySapxstoreController } from './inventory-sapxstore.controller';
import { InventorySapxstoreService } from './inventory-sapxstore.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: 0,
      }),
    }),
  ],
  controllers: [InventorySapxstoreController],
  providers: [InventorySapxstoreService],
})
export class InventorySapxstoreModule { }
