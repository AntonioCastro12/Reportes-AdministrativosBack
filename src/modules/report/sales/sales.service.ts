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
} from "./queries/invoice-total.query";
// import { InvoiceTotalResponse } from "./model/sales.response";

@Injectable()
export class SalesService {
	constructor(
		private connectionByStoreService: ConnectionByStoreService,
		private loggerSystemService: LoggerSystemService
	) {}

	async invoiceTotal(data: InvoiceTotalDTO) {
		try {
			// Get Xstore params connection by store
			const xstoreConnectionObject =
				await this.connectionByStoreService.xstoreConnection(data.storeId);

			await sql.connect(xstoreConnectionObject);

			// Build queryString
			const queryStringSales = SalesQuery(data);
			const queryStringReturns = ReturnQuery(data);
			const queryStringFreight = FreightQuery(data);

			// Fetch all data
			const [presultSales, presultReturns, presultFreight] = [
				await sql.query(queryStringSales),
				await sql.query(queryStringReturns),
				await sql.query(queryStringFreight),
			];
			// const resultSales: InvoiceTotalResponse = presultSales.recordset[0];
			// const resultReturns: InvoiceTotalResponse = presultReturns.recordset[0];
			// const resultFreight: InvoiceTotalResponse = presultFreight.recordset[0];

			// return {
			// 	sales: resultSales,
			// 	returns: resultReturns,
			// 	freight: resultFreight,
			// };
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
