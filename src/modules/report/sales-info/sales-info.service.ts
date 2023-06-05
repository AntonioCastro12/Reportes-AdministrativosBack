// CORE
import {
	CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";

// LOCAL
import { SalesInfoDTO } from "./sales-info.dto";
import { salesInfoReportQuery } from "./sales-info-query/sales-info-report";

// VENDORS

import * as sql from "mssql";
// import * as moment from 'moment';

@Injectable()
export class SalesInfoService {
	// async report(data: SalesInfoDTO) {
	//   const storeConnList: Promise<Array<any>> = this.cacheManager.get(
	//     'storeConnList',
	//   );
	//   const params = (await storeConnList).find(
	//     element => element.storeConnId === data.storeInfoId,
	//   );
	//   const connectionObject = new sql.ConnectionPool({
	//     user: params.storeConnUser,
	//     password: params.storeConnPassword,
	//     server: params.storeConnIpAddress,
	//     port: parseInt(params.storeConnPort),
	//     database: params.storeConnStoreDatabase,
	//     connectionTimeout: 12000000,
	//     options: {
	//       encrypt: false,
	//       enableArithAbort: false,
	//     },
	//   }).config;
	//   console.warn(
	//     'sales-info',
	//     data.storeInfoId,
	//     moment().format('YYYY-MM-DD HH:mm:ss'),
	//   );
	//   try {
	//     const queryString = salesInfoReportQuery(data);
	//     await sql.connect(connectionObject);
	//     const preResult = await sql.query(queryString);
	//     const resultBeta = preResult.recordset;
	//     const result = resultBeta.map(x => {
	//       return {
	//         ...x,
	//         string: String(x.translation),
	//       };
	//     });
	//     return result;
	//   } catch (error) {
	//     const message =
	//       'Ha ocurrido un error en salesInfoReport: ' +
	//       (error.message || error.name);
	//     console.log(error);
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//   } finally {
	//     await sql.close();
	//   }
	// }
}
