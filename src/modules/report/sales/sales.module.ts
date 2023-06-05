import { Module } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { SalesController } from "./sales.controller";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule],
	controllers: [SalesController],
	providers: [
		SalesService,
		ConnectionByStoreService,
		LoggerSystemService,
		PrismaService,
	],
})
export class SalesModule {}
