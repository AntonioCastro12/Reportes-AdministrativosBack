import { Module } from "@nestjs/common";
import { ExtrasService } from "./extras.service";
import { ExtrasController } from "./extras.controller";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { PrismaService } from "src/shared/services/prisma.service";

@Module({
	controllers: [ExtrasController],
	providers: [ExtrasService, LoggerSystemService, PrismaService],
})
export class ExtrasModule {}
