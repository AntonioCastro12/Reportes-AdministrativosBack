import { Controller, Get, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GeneralSalesDTO, InvoiceTotalDTO } from "./model/sales.dto";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import {
	GeneralSalesResponse,
	InvoiceTotalResponse,
} from "./model/sales.response";
import { Roles } from "src/shared/decorator/roles.decorator";

@ApiTags("sales")
@Controller("sales")
export class SalesController {
	constructor(private readonly salesService: SalesService) {}

	@Get("invoice-total")
	@Roles("staff-ingresos,sistemas")
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

	@Get("general-sales")
	@Roles("staff-ingresos,sistemas")
	@ApiOperation({
		summary: "Informe general de ventas",
	})
	@ApiResponse({
		type: GeneralSalesResponse,
		description: `General Sales Report`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	generalSales(@Query() data: GeneralSalesDTO) {
		return this.salesService.generalSales(data);
	}
}
