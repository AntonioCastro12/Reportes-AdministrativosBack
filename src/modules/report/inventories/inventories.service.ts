import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
	InventoryComparisonDTO,
	InventoryStockDTO,
	KardexProductDTO,
	Origin,
} from "./model/inventories.dto";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { xCenterConnectionObject } from "src/connectors/mssql.connector";
import * as sql from "mssql";
import { kardexProductQuery } from "./queries/kardex-prodcut.query";
import { LogOptions } from "src/shared/model/logger.dto";
import {
	InventoryComparisonResponse,
	InventoryStockDetailResponse,
	InventoryStockResumeResponse,
	KardexProductResponse,
} from "./model/inventories.response";
import {
	inventoryStockDetailQuery,
	inventoryStockResumeQuery,
} from "./queries/inventory-stock.query";
import { localMariaDb } from "src/connectors/mariadb.connector";
import { inventoryComparisonQuery } from "./queries/inventory-comparison.query";

export
@Injectable()
class InventoriesService {
	constructor(
		private connectionByStoreService: ConnectionByStoreService,
		private loggerSystemService: LoggerSystemService
	) {}

	async getKardexProduct(
		data: KardexProductDTO
	): Promise<Array<KardexProductResponse>> {
		try {
			if (data.origin == Origin.xcenter) {
				await sql.connect(xCenterConnectionObject);
			}
			if (data.origin == Origin.xstore) {
				// Get Xstore params connection by store
				const xstoreConnectionObject =
					await this.connectionByStoreService.xstoreConnection(data.storeId);

				await sql.connect(xstoreConnectionObject);
			}

			const queryString = kardexProductQuery(data);
			const preResult = await sql.query(queryString);
			const result = preResult.recordset;
			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en Kardex Product Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async getInventoryStockResume(
		data: InventoryStockDTO
	): Promise<Array<InventoryStockResumeResponse>> {
		try {
			// Get Xstore params connection by store
			const xstoreConnectionObject =
				await this.connectionByStoreService.xstoreConnection(data.storeId);

			await sql.connect(xstoreConnectionObject);

			const queryString = inventoryStockResumeQuery();
			await sql.connect(xstoreConnectionObject);
			const preResult = await sql.query(queryString);
			const result = preResult.recordset;
			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en Inventory Stock Resume Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async getInventoryStockDetail(
		data: InventoryStockDTO
	): Promise<Array<InventoryStockDetailResponse>> {
		try {
			// Get Xcenter params connection by store
			const xstoreConnectionObject =
				await this.connectionByStoreService.xstoreConnection(data.storeId);

			await sql.connect(xstoreConnectionObject);

			const queryString = inventoryStockDetailQuery();
			await sql.connect(xstoreConnectionObject);
			const preResult = await sql.query(queryString);
			const result = preResult.recordset;
			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en Inventory Stock Detail Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async inventoryComparison(
		data: InventoryComparisonDTO
	): Promise<Array<InventoryComparisonResponse>> {
		const cnn = await localMariaDb();
		try {
			const queryString = inventoryComparisonQuery(data);
			const preResult = await cnn.query(queryString);
			const result = JSON.parse(JSON.stringify(preResult[0]));
			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en Inventory Comparison Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await cnn.end();
		}
	}
}
