import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class HistoryInterceptor implements NestInterceptor {
	constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

	async saveData(data) {
		await this.prismaService.userSearchCriteria.create({
			data: {
				...data,
			},
		});
	}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const { query, url, user } = request;
		console.log({ query, url, user: user.sub });
		this.saveData({ searchCriteria: query, url, userId: user.sub });
		return next.handle();
	}
}
