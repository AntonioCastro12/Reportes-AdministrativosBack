import { Controller, Get, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { InvoiceTotalDTO } from "./model/sales.dto";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import { InvoiceTotalResponse } from "./model/sales.response";

@ApiTags("sales")
@Controller("sales")
export class SalesController {
	constructor(private readonly salesService: SalesService) {}

	@Get("invoice-total")
	@ApiOperation({
		summary: "Totales de facturación",
	})
	@ApiResponse({
		type: InvoiceTotalResponse,
		description: `Inventory Stock Detail`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	invoiceTotal(@Query() data: InvoiceTotalDTO) {
		return this.salesService.invoiceTotal(data);
	}
}
