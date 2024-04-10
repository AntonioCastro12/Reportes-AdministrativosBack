import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SalesReturnsMemberDTO } from "./model/extras.dto";
import { LoggerSystemService } from "src/shared/services/logger.service";
import { relateConnectionObject } from "src/connectors/mssql.connector";
import * as sql from "mssql";
import { LogOptions } from "src/shared/model/logger.dto";
import { salesReturnsByMemberQuery } from "./queries/sales-return.query";

@Injectable()
export class ExtrasService {
	constructor(private readonly loggerSystemService: LoggerSystemService) {}

	async salesMember(data: SalesReturnsMemberDTO) {
		try {
			const queryString = salesReturnsByMemberQuery(data);
			await sql.connect(relateConnectionObject);
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
				"Ha ocurrido un error en Sasles & Returns by member Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}
}
