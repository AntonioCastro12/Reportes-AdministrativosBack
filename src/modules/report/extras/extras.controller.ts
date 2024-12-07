import {
	Controller,
	Get,
	Query,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { ExtrasService } from "./extras.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SalesReturnsMemberDTO } from "./model/extras.dto";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import { SalesReturnsResponse } from "./model/extras.response";

@ApiTags("extras")
@Controller("extras")
export class ExtrasController {
	constructor(private readonly extrasService: ExtrasService) {}

	@Get("sales-member")
	@UsePipes(new ValidationPipe())
	@ApiOperation({
		summary: "Reporte de acumulado de ventas y devoluciones por socio",
	})
	@ApiResponse({
		type: SalesReturnsResponse,
		description: `Sales & Return by member`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	salesMember(@Query() data: SalesReturnsMemberDTO) {
		return this.extrasService.salesMember(data);
	}
}
