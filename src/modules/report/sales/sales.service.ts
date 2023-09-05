import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LogOptions } from "src/shared/model/logger.dto";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import * as sql from "mssql";
import { GeneralSalesDTO, InvoiceTotalDTO, WholesaleSalesDTO } from "./model/sales.dto";
import { invoiceTotalQuery } from "./queries/invoice-total.query";
import { InvoiceTotalFetch } from "./model/sales.fetch";
import {
	generalSalesPaymentMethodQuery,
	generalSalesSaleQuery,
	wholesaleSalesQuery,
} from "./queries/general-sales.query";
import { InvoiceTotalResponse } from "./model/sales.response";

@Injectable()
export class SalesService {
	constructor(
		private connectionByStoreService: ConnectionByStoreService,
		private loggerSystemService: LoggerSystemService
	) { }

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
				const temp = new InvoiceTotalResponse();

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
					temp.totalMoneyReturn = Math.abs(returnObject.totalMoneyReturn);
					temp.totalUnitReturn = returnObject.totalUnitReturn;
					temp.unitPercentReturn =
						saleObject.totalUnitSale > 0
							? (returnObject.totalUnitReturn * 100) / saleObject.totalUnitSale
							: 0;
					temp.totalPercentReturn =
						saleObject.totalMoneySale > 0
							? (Math.abs(returnObject.totalMoneyReturn) * 100) /
							saleObject.totalMoneySale
							: 0;
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

	async generalSales(data: GeneralSalesDTO) {
		try {
			// Get Xstore params connection by store
			const xstoreConnectionObject =
				await this.connectionByStoreService.xstoreConnection(data.storeId);

			await sql.connect(xstoreConnectionObject);

			// Build queryString
			const queryStringSale = generalSalesSaleQuery(data);
			const queryStringPaymentMethod = generalSalesPaymentMethodQuery(data);

			// Fetch all data
			const [sales, paymentMethod] = [
				await sql.query(queryStringSale),
				await sql.query(queryStringPaymentMethod),
			];

			const result = {
				sales: {
					name: "Ventas",
					data: sales.recordset,
				},
				paymentMethod: {
					name: "Metodos de pago",
					data: paymentMethod.recordset,
				},
			};

			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en General Sales Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async wholesaleSales(data: WholesaleSalesDTO) {
		try {
			// Get Xstore params connection by store
			const xstoreConnectionObject =
				await this.connectionByStoreService.xstoreConnection(data.storeId);


			await sql.connect(xstoreConnectionObject);

			// Build queryString
			const query = wholesaleSalesQuery(data);
			// Fetch all data
			const wholeSaleSales = await sql.query(query);
			const result = wholeSaleSales.recordset
			return result;
		} catch (error) {
			this.loggerSystemService.create({
				level: LogOptions.error,
				message: error.message,
				stacktrace: error.stack,
			});
			const message =
				"Ha ocurrido un error en General Sales Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}
}
