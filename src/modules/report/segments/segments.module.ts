import { Module } from "@nestjs/common";
import { SegmentsService } from "./segments.service";
import { SegmentsController } from "./segments.controller";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule],
	controllers: [SegmentsController],
	providers: [
		SegmentsService,
		ConnectionByStoreService,
		LoggerSystemService,
		PrismaService,
	],
})
export class SegmentsModule {}
