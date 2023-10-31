import {
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { PointProgramService } from "./point-program.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import {
	DetailPointDTO,
	DetailWalletDTO,
	TotalMovDTO,
} from "./model/point-program.dto";
import {
	DetailPointResponse,
	DetailWalletResponse,
	TotalMovResponse,
} from "./model/point-program.response";
import { Roles } from "src/shared/decorator/roles.decorator";
import { RoleGuard } from "src/shared/guard/roles.guard";
import { HistoryInterceptor } from "src/shared/interceptors/history.interceptor";

@ApiTags("point-program")
@Controller("point-program")
@UseGuards(RoleGuard)
@UseInterceptors(HistoryInterceptor)
export class PointProgramController {
	constructor(private readonly pointProgramService: PointProgramService) {}

	@Get("total-movement")
	@Roles("staff-marketing,sistemas")
	@ApiOperation({
		summary: "Reporte de Totales de movimiento de puntos y monedero",
	})
	@ApiResponse({
		type: TotalMovResponse,
		description: `Total Points and Wallet Movements`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	totalMovement(@Query() data: TotalMovDTO) {
		return this.pointProgramService.totalMovement(data);
	}

	@Get("detail-points")
	@Roles("staff-marketing,sistemas")
	@ApiOperation({
		summary: "Reporte de Detalle de moviminetos de puntos y premios",
	})
	@ApiResponse({
		type: DetailPointResponse,
		description: `Total Points and Wallet Movements`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	detailPoints(@Query() data: DetailPointDTO) {
		return this.pointProgramService.detailPoints(data);
	}

	@Get("detail-wallet")
	@Roles("staff-marketing,sistemas")
	@ApiOperation({
		summary: "Reporte de Detalle de moviminetos de monedero",
	})
	@ApiResponse({
		type: DetailWalletResponse,
		description: `Total Points and Wallet Movements`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	detailWallet(@Query() data: DetailWalletDTO) {
		return this.pointProgramService.detailWallet(data);
	}
}
