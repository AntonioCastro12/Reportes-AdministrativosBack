import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LogOptions } from "src/shared/model/logger.dto";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import * as sql from "mssql";
import { InvoiceTotalDTO } from "./model/sales.dto";
import {
	FreightQuery,
	ReturnQuery,
	SalesQuery,
	invoiceTotalQuery,
} from "./queries/invoice-total.query";
import { InvoiceTotalFetch } from "./model/sales.fetch";
// import { InvoiceTotalResponse } from "./model/sales.response";

@Injectable()
export class SalesService {
	constructor(
		private connectionByStoreService: ConnectionByStoreService,
		private loggerSystemService: LoggerSystemService
	) {}

	async invoiceTotal(data: InvoiceTotalDTO) {
		try {
			const result = [];

			// Get Xstore params connection by store
			const xstoreConnectionObject =
				await this.connectionByStoreService.xstoreConnection(data.storeId);

			await sql.connect(xstoreConnectionObject);

			// Build queryString
			const queryStringUnion = invoiceTotalQuery(data);

			// Fetch all data
			const preRecords = await sql.query(queryStringUnion);

			const records: InvoiceTotalFetch[] = preRecords.recordset;

			const tempDateArray = records.map((record) => record.businessDate);
			const dateArray = [...new Set(tempDateArray)];

			for (const d of dateArray) {
				const temp = new InvoiceTotalFetch();

				const saleObject = records.find(
					(x) => x.businessDate === d && x.saleTypeSale === "Ventas"
				);
				const returnObject = records.find(
					(x) => x.businessDate === d && x.saleTypeReturn === "Devoluciones"
				);
				const freightObject = records.find(
					(x) => x.businessDate === d && x.saleTypeFreight === "Fletes"
				);

				if (saleObject) {
					temp.storeId = saleObject.storeId;
					temp.businessDate = saleObject.businessDate;
					temp.saleTypeSale = saleObject.saleTypeSale;
					temp.countInvoiceSale = saleObject.countInvoiceSale;
					temp.totalMoneySale = saleObject.totalMoneySale;
					temp.totalUnitSale = saleObject.totalUnitSale;
				}

				if (returnObject) {
					temp.storeId = returnObject.storeId;
					temp.businessDate = returnObject.businessDate;
					temp.saleTypeReturn = returnObject.saleTypeReturn;
					temp.countInvoiceReturn = returnObject.countInvoiceReturn;
					temp.totalMoneyReturn = returnObject.totalMoneyReturn;
					temp.totalUnitReturn = returnObject.totalUnitReturn;
				}

				if (freightObject) {
					temp.storeId = freightObject.storeId;
					temp.businessDate = freightObject.businessDate;
					temp.saleTypeFreight = freightObject.saleTypeFreight;
					temp.countInvoiceFreight = freightObject.countInvoiceFreight;
					temp.totalMoneyFreight = freightObject.totalMoneyFreight;
					temp.totalUnitFreight = freightObject.totalUnitFreight;
				}

				result.push(temp);
			}

			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en Invoice Total Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}
}
