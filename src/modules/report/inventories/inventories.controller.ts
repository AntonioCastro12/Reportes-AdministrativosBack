import {
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { InventoriesService } from "./inventories.service";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import {
	CycleCountDTO,
	InventoryComparisonDTO,
	InventoryStockDTO,
	KardexProductDTO,
	PODDTO,
} from "./model/inventories.dto";
import {
	CycleCountResponse,
	DifferenceSapXstore,
	InventoryComparisonResponse,
	InventoryStockDetailResponse,
	InventoryStockResumeResponse,
	KardexProductResponse,
	PODResponse,
} from "./model/inventories.response";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import { Roles } from "src/shared/decorator/roles.decorator";
import { RoleGuard } from "src/shared/guard/roles.guard";
import { HistoryInterceptor } from "src/shared/interceptors/history.interceptor";

@ApiBearerAuth("Authorization")
@ApiTags("inventories")
@Controller("inventories")
@UseGuards(RoleGuard)
@UseInterceptors(HistoryInterceptor)
export class InventoriesController {
	constructor(private readonly inventoriesService: InventoriesService) {}

	@Get("kardex-product")
	@Roles("tienda,staff-menudeo,staff-mayoreo,staff-inventarios-ost,sistemas")
	@ApiOperation({ summary: "Kardex de artículo" })
	@ApiResponse({
		type: KardexProductResponse,
		description: `Kardex Product Report`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	getKardexProduct(@Query() data: KardexProductDTO) {
		return this.inventoriesService.getKardexProduct(data);
	}

	@Get("inventory-stock/resume")
	@Roles("tienda,staff-menudeo,staff-mayoreo,staff-inventarios-ost,sistemas")
	@ApiOperation({ summary: "Existencia de inventario (resumen)" })
	@ApiResponse({
		type: InventoryStockResumeResponse,
		description: `Inventory Stock Resume`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	getInventoryStockResume(@Query() data: InventoryStockDTO) {
		return this.inventoriesService.getInventoryStockResume(data);
	}

	@Get("inventory-stock/detail")
	@Roles("tienda,staff-menudeo,staff-mayoreo,staff-inventarios-ost,sistemas")
	@ApiOperation({ summary: "Existencia de inventario (detalle)" })
	@ApiResponse({
		type: InventoryStockDetailResponse,
		description: `Inventory Stock Detail`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	getInventoryStockDetail(@Query() data: InventoryStockDTO) {
		return this.inventoriesService.getInventoryStockDetail(data);
	}

	@Get("inventory-comparison")
	@Roles("sistemas")
	@ApiOperation({ summary: "Comparación de inventarios" })
	@ApiResponse({
		type: InventoryComparisonResponse,
		description: `Inventory Stock Detail`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	inventoryComparison(@Query() data: InventoryComparisonDTO) {
		return this.inventoriesService.inventoryComparison(data);
	}

	@Get("cycle-count")
	@Roles("tienda,staff-menudeo,staff-mayoreo,sistemas")
	@ApiOperation({ summary: "Cumplimiento de conteos cíclicos" })
	@ApiResponse({
		type: CycleCountResponse,
		description: `Cycle Count Report`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	cycleCount(@Query() data: CycleCountDTO) {
		return this.inventoriesService.cycleCount(data);
	}

	@Get("sap-xstore")
	@Roles("sistemas,staff-menudeo,staff-mayoreo")
	@ApiOperation({ summary: "Diferencia de inventario SAP vs Xstore" })
	@ApiResponse({
		type: DifferenceSapXstore,
		description: `Inventory Stock Detail`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	sapXstore() {
		return this.inventoriesService.sapXstore();
	}

	@Get("pod")
	@Roles("staff-planeacion,sistemas")
	@ApiOperation({ summary: "Reporte de Recepción de mercancía" })
	@ApiResponse({
		type: PODResponse,
		description: `Merchandise reception`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	pod(@Query() data: PODDTO) {
		return this.inventoriesService.pod(data);
	}
}
