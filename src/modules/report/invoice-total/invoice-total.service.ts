// CORE
import {
	CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";

// LOCAL
// import { InvoiceTotalDTO } from "./invoice-total.dto";
// import { invoiceTotalSaleReportQuery } from "./invoice-total-query/invoice-total-sale-report";
// import { invoiceTotalReturnReportQuery } from "./invoice-total-query/invoice-total-return-report";
// import { invoiceTotalFreightReportQuery } from "./invoice-total-query/invoice-total-freight-report";

// VENDORS
import * as sql from "mssql";

// import * as moment from 'moment';
@Injectable()
export class InvoiceTotalService {
	// async report(data: InvoiceTotalDTO) {
	// 	const storeConnList: Promise<Array<any>> =
	// 		this.cacheManager.get("storeConnList");
	// 	const params = (await storeConnList).find(
	// 		(element) => element.storeConnId === data.storeInfoId
	// 	);
	// 	const connectionObject = new sql.ConnectionPool({
	// 		user: params.storeConnUser,
	// 		password: params.storeConnPassword,
	// 		server: params.storeConnIpAddress,
	// 		port: parseInt(params.storeConnPort),
	// 		database: params.storeConnStoreDatabase,
	// 		requestTimeout: 240000,
	// 		connectionTimeout: 30000,
	// 		pool: {
	// 			max: 10,
	// 			min: 0,
	// 			idleTimeoutMillis: 30000,
	// 		},
	// 		options: {
	// 			encrypt: false,
	// 			enableArithAbort: false,
	// 		},
	// 	}).config;
	// 	console.warn(
	// 		"invoice_total",
	// 		data.storeInfoId,
	// 		moment().format("YYYY-MM-DD HH:mm:ss")
	// 	);
	// 	try {
	// 		const queryStringSales = invoiceTotalSaleReportQuery(data);
	// 		const queryStringReturns = invoiceTotalReturnReportQuery(data);
	// 		const queryStringFreight = invoiceTotalFreightReportQuery(data);
	// 		await sql.connect(connectionObject);
	// 		const preResultSales = await sql.query(queryStringSales);
	// 		const resultSales = preResultSales.recordset;
	// 		await sql.connect(connectionObject);
	// 		const preResultReturns = await sql.query(queryStringReturns);
	// 		const resultReturns = preResultReturns.recordset;
	// 		await sql.connect(connectionObject);
	// 		const preResultFreight = await sql.query(queryStringFreight);
	// 		const resultFreight = preResultFreight.recordset;
	// 		const dateArray = this.onDateInterval(
	// 			data.startDate,
	// 			data.endDate,
	// 			data.storeInfoId
	// 		);
	// 		const resultTemp = {
	// 			sales: resultSales,
	// 			returns: resultReturns,
	// 			freight: resultFreight,
	// 			dateArray: dateArray,
	// 		};
	// 		const result = this.onJoinInSingleArray(resultTemp);
	// 		return result;
	// 	} catch (error) {
	// 		const message =
	// 			"Ha ocurrido un error en invoiceTotalReport: " +
	// 			(error.message || error.name);
	// 		throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	// 	} finally {
	// 		await sql.close();
	// 	}
	// }
	// onJoinInSingleArray(dataTemp) {
	// 	const map = new Map();
	// 	const sales = dataTemp.sales;
	// 	const returns = dataTemp.returns;
	// 	const freight = dataTemp.freight;
	// 	const dateArray = dataTemp.dateArray;
	// 	const salesDate = dateArray;
	// 	let resultDate = [];
	// 	if (Array.isArray(salesDate) && Array.isArray(sales)) {
	// 		for (let i = 0; i < salesDate.length; i++) {
	// 			resultDate.push({
	// 				...salesDate[i],
	// 				...sales.find(
	// 					(itmInner) => itmInner.businessDate === salesDate[i].businessDate
	// 				),
	// 				returns_connection: true,
	// 			});
	// 		}
	// 	} else {
	// 		resultDate = salesDate.map((x) => {
	// 			return {
	// 				...x,
	// 				returns_connection: false,
	// 			};
	// 		});
	// 	}
	// 	const salesSales = resultDate;
	// 	let resultSales = [];
	// 	if (Array.isArray(salesSales) && Array.isArray(returns)) {
	// 		for (let i = 0; i < salesSales.length; i++) {
	// 			resultSales.push({
	// 				...salesSales[i],
	// 				...returns.find(
	// 					(itmInner) =>
	// 						itmInner.businessDate === salesSales[i].businessDate &&
	// 						itmInner.storeId === salesSales[i].storeId
	// 				),
	// 				returns_connection: true,
	// 			});
	// 		}
	// 	} else {
	// 		resultSales = salesSales.map((x) => {
	// 			return {
	// 				...x,
	// 				returns_connection: false,
	// 			};
	// 		});
	// 	}
	// 	const salesNew = resultSales;
	// 	let resultNew = [];
	// 	if (Array.isArray(salesNew) && Array.isArray(freight)) {
	// 		for (let i = 0; i < salesNew.length; i++) {
	// 			resultNew.push({
	// 				...salesNew[i],
	// 				...freight.find(
	// 					(itmInner) =>
	// 						itmInner.businessDate === salesNew[i].businessDate &&
	// 						itmInner.storeId === salesNew[i].storeId
	// 				),
	// 				returns_connection: true,
	// 			});
	// 		}
	// 	} else {
	// 		resultNew = salesNew.map((x) => {
	// 			return {
	// 				...x,
	// 				returns_connection: false,
	// 			};
	// 		});
	// 	}
	// 	return resultNew;
	// }
	// onDateInterval(startDate?, endDate?, storeId?) {
	// 	const dateDifference = moment(endDate).diff(moment(startDate), "days");
	// 	const dateArray = [];
	// 	for (let i = 0; i <= dateDifference; i++) {
	// 		const newDate = {
	// 			businessDate: moment(startDate).add(i, "days").format("YYYY-MM-DD"),
	// 			storeId: storeId,
	// 		};
	// 		dateArray.push(newDate);
	// 	}
	// 	return dateArray;
	// }
}
