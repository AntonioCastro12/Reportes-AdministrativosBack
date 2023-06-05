// CORE
import {
	CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";

// LOCAL
import { frozenMonitorReportQuery } from "./frozen-monitor-query/frozen-monitor-report-query";
import { FrozenMonitorDTO } from "./frozen-monitor.dto";

// VENDORS

import * as sql from "mssql";

@Injectable()
export class FrozenMonitorService {
	// async report(data: FrozenMonitorDTO) {
	//   const storeConnList: Promise<Array<any>> = this.cacheManager.get('storeConnList');
	//   const params = (await storeConnList).find(element => element.storeConnId === data.storeInfoId);
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
	//   try {
	//     const queryString = frozenMonitorReportQuery(data);
	//     await sql.connect(connectionObject);
	//     const preResult = await sql.query(queryString);
	//     const result = preResult.recordset;
	//     return result;
	//   } catch (error) {
	//     const message =
	//       'Ha ocurrido un error en frozenMonitorReport: ' +
	//       (error.message || error.name);
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//   } finally {
	//     await sql.close();
	//   }
	// }
}
