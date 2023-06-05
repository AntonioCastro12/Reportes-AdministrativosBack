import { Module } from "@nestjs/common";
import { InventoriesService } from "./inventories.service";
import { InventoriesController } from "./inventories.controller";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { HttpModule } from "@nestjs/axios";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { PrismaService } from "src/shared/services/prisma.service";

@Module({
	imports: [HttpModule],
	controllers: [InventoriesController],
	providers: [
		InventoriesService,
		ConnectionByStoreService,
		LoggerSystemService,
		PrismaService,
	],
})
export class InventoriesModule {}
