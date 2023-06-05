import { Controller, Get, Query } from "@nestjs/common";
import { InventoriesService } from "./inventories.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
	InventoryComparisonDTO,
	InventoryStockDTO,
	KardexProductDTO,
} from "./model/inventories.dto";
import {
	InventoryComparisonResponse,
	InventoryStockDetailResponse,
	InventoryStockResumeResponse,
	KardexProductResponse,
} from "./model/inventories.response";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";

export
@ApiTags("inventories")
@Controller("inventories")
class InventoriesController {
	constructor(private readonly inventoriesService: InventoriesService) {}

	@Get("kardex-product")
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
	@ApiOperation({ summary: "Cumplimiento de conteos cíclicos" })
	getCycleCount() {}

	@Get("merchandise-reception")
	@ApiOperation({ summary: "Recepción de mercancía" })
	getMerchandiseReception() {}
}
