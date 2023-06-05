import { Inject, Logger } from "@nestjs/common";
import { LogguerServiceDTO } from "../model/logger.dto";
import { PrismaService } from "./prisma.service";

export class LoggerSystemService {
	constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

	private readonly logger = new Logger();

	async create(data: LogguerServiceDTO): Promise<void> {
		switch (data.level) {
			case "error":
				this.logger.error(data.stacktrace);
				break;
			case "warn":
				this.logger.warn(data.message);
				break;
			case "debug":
				this.logger.debug(data.message);
				break;
			case "verbose":
				this.logger.verbose(data.message);
				break;
			default:
				this.logger.log(data.message);
				break;
		}

		await this.prismaService.log.create({
			data,
		});
	}
}
