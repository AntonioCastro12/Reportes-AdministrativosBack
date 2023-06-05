// CORE
import {
	CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";

// LOCAL
import {
	TransactionMonitorInterfaceXStore,
	TransactionMonitorInterfaceXHub,
} from "./transaction-monitor.interface";
import { transactionMonitorXHubSaleReportQuery } from "./transaction-monitor-query/transaction-monitor-xhub-sale-report-query";
import { transactionMonitorXsSaleReportQuery } from "./transaction-monitor-query/transaction-monitor-xs-sale-report-query";
import { TransactionMonitorDTO } from "./transaction-monitor.dto";
import { transactionMonitorXsReturnReportQuery } from "./transaction-monitor-query/transaction-monitor-xs-return-report-query";
import { transactionMonitorXHubReturnReportQuery } from "./transaction-monitor-query/transaction-monitor-xhub-return-report-query";

// VENDORS

import * as sql from "mssql";

// CONNECTORS
// import { xhubConnectionObject } from 'src/connectors/mssql-xhub.pool';

@Injectable()
export class TransactionMonitorService {
	// async report(data: TransactionMonitorDTO) {
	//   const result = [];
	//   try {
	//     if (data.type === 'Ventas') {
	//       const xsSaleQuery = transactionMonitorXsSaleReportQuery(data);
	//       const xsSale: Array<TransactionMonitorInterfaceXStore> = await this.xsExecuteQuery(data, xsSaleQuery, 'transactionMonitorXsSaleReport');
	//       const xhSaleQuery = transactionMonitorXHubSaleReportQuery(data);
	//       const xhSale: Array<TransactionMonitorInterfaceXHub> = await this.xHubExecuteQuery(xhSaleQuery, 'transactionMonitorXHubSaleReport');
	//       if (Array.isArray(xsSale) && Array.isArray(xhSale)) {
	//     for (let i = 0; i < xsSale.length; i++) {
	//       result.push({
	//         ...xsSale[i],
	//         ...xhSale.find(
	//           itmInner => itmInner.xhub_productId === xsSale[i].xs_productId
	//         )
	//       });
	//     }
	//   }
	//     } else if (data.type === 'Devoluciones') {
	//      const xsReturnQuery = transactionMonitorXsReturnReportQuery(data);
	//       const xsReturn: Array<TransactionMonitorInterfaceXStore> = await this.xsExecuteQuery(data, xsReturnQuery, 'transactionMonitorXsReturnReport');
	//       const xhReturnQuery = transactionMonitorXHubReturnReportQuery(data);
	//       const xhReturn: Array<TransactionMonitorInterfaceXHub> = await this.xHubExecuteQuery(xhReturnQuery, 'transactionMonitorXHubReturnReport');
	//       if (Array.isArray(xsReturn) && Array.isArray(xhReturn)) {
	//     for (let i = 0; i < xsReturn.length; i++) {
	//       result.push({
	//         ...xsReturn[i],
	//         ...xhReturn.find(
	//           itmInner => itmInner.xhub_productId === xsReturn[i].xs_productId
	//         )
	//       });
	//     }
	//   }
	//     } else {
	//       const message =
	//       'Tipo de transacción incorrecta'
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//    }
	//     return result;
	//   } catch (error) {
	//     const message =
	//       `Ha ocurrido un error en transactionMonitorReport: ` +
	//       (error.message || error.name);
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//   }
	// }
	// async xsExecuteQuery(data: TransactionMonitorDTO, queryString: string, queryName: string) {
	//   const storeConnList: Promise<Array<any>> = this.cacheManager.get('storeConnList');
	//   const params = (await storeConnList).find(element => element.storeConnId === data.storeInfoId);
	//   const connectionObject = new sql.ConnectionPool({
	//     user: params.storeConnUser,
	//     password: params.storeConnPassword,
	//     server: params.storeConnIpAddress,
	//     port: parseInt(params.storeConnPort),
	//     database: params.storeConnStoreDatabase,
	//     connectionTimeout: 12000000, // Not always works
	//     options: {
	//       encrypt: false,
	//       enableArithAbort: false,
	//       requestTimeout: 300000 // Beter way to request time out
	//     },
	//   }).config;
	//   try {
	//     await sql.connect(connectionObject);
	//     const preResult = await sql.query(queryString);
	//     const result = preResult.recordset;
	//     return result;
	//   } catch (error) {
	//     const message =
	//       `Ha ocurrido un error en ${queryName}: ` +
	//       (error.message || error.name);
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//   } finally {
	//     await sql.close();
	//   }
	// }
	// async xHubExecuteQuery(queryString: string, queryName: string) {
	//   try {
	//     await sql.connect(xhubConnectionObject);
	//     const preResult = await sql.query(queryString);
	//     const result = preResult.recordset;
	//     return result;
	//   } catch (error) {
	//     const message =
	//       `Ha ocurrido un error en ${queryName} ` +
	//       (error.message || error.name);
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//   } finally {
	//     await sql.close();
	//   }
	// }
}
