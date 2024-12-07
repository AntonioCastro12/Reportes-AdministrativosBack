import { Module } from "@nestjs/common";
import { PointProgramService } from "./point-program.service";
import { PointProgramController } from "./point-program.controller";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule],
	controllers: [PointProgramController],
	providers: [
		PointProgramService,
		ConnectionByStoreService,
		LoggerSystemService,
		PrismaService,
	],
})
export class PointProgramModule {}
