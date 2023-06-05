// CORE
import {
	CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";

// LOCAL
import { InventorySapxstoreDTO } from "./inventory-sapxstore.dto";
import { inventorySapxstoreReportQuery } from "./inventory-sapxstore-query/inventory-sapxstore-report-query";

// VENDORS
import * as sql from "mssql";
// import * as moment from 'moment';

// CONNECTORS
// import { xhubConnectionObject } from 'src/connectors/mssql-xhub.pool';

@Injectable()
export class InventorySapxstoreService {
	result: Array<any> = [];

	// async report(data: InventorySapxstoreDTO) {
	//   try {
	//     const queryString = inventorySapxstoreReportQuery(data);
	//     await sql.connect(xhubConnectionObject);
	//     const preResult = await sql.query(queryString);
	//     const result = preResult.recordset;
	//     return result;
	//   } catch (error) {
	//     const message =
	//       'Ha ocurrido un error en InventorySapxstoreReport: ' +
	//       (error.message || error.name);
	//     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	//   } finally {
	//     await sql.close();
	//   }
	// }
}
