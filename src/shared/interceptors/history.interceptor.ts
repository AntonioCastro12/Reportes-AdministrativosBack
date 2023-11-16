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
		try {
			await this.prismaService.userSearchCriteria.create({
				data: {
					...data,
				},
			});
		} catch (error) {
			console.error(error);
		}
	}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const { query, url, user } = request;
		this.saveData({ searchCriteria: query, url, userId: user.sub });
		return next.handle();
	}
}
