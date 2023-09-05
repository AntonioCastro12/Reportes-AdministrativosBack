import { Controller, Get, Query, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GeneralSalesDTO, InvoiceTotalDTO, WholesaleSalesDTO } from "./model/sales.dto";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import {
	GeneralSalesResponse,
	InvoiceTotalResponse,
	WholesaleSalesResponse,
} from "./model/sales.response";
import { Roles } from "src/shared/decorator/roles.decorator";
import { RoleGuard } from "src/shared/guard/roles.guard";
import { HistoryInterceptor } from "src/shared/interceptors/history.interceptor";

@ApiTags("sales")
@Controller("sales")
@UseGuards(RoleGuard)
@UseInterceptors(HistoryInterceptor)
export class SalesController {
	constructor(private readonly salesService: SalesService) { }

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
	generalSales(@Query() data: GeneralSalesDTO, @Request() req: any) {
		return this.salesService.generalSales(data);
	}

	@Get("wholesale-sales")
	//@Roles("staff-ingresos,sistemas")
	@ApiOperation({
		summary: "Ventas al mayoreo",
	})
	@ApiResponse({
		type: WholesaleSalesResponse,
		description: `Wholesale Report`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	@Roles("staff-ingresos,sistemas")
	wholesaleSales(@Query() data: WholesaleSalesDTO) {
		return this.salesService.wholesaleSales(data);
	}
}
