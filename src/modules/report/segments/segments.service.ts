import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LogOptions } from "src/shared/model/logger.dto";
import { LoggerSystemService } from "src/shared/services/logger.service";
import * as sql from "mssql";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { relateConnectionObject } from "src/connectors/mssql.connector";
import { collaboratosNazanQuery } from "./queries/collaborator-nazan.query";
import {
	AffiliatedKiponDTO,
	CollaboratorsNazanDTO,
} from "./model/segments.dto";
import {
	AffiliatedKiponResponse,
	CollaboratorsNazanResponse,
} from "./model/segments.response";
import { affiliatedKiponQuery } from "./queries/affiliated-kipon.query";

@Injectable()
export class SegmentsService {
	constructor(
		private readonly connectionByStoreService: ConnectionByStoreService,
		private readonly loggerSystemService: LoggerSystemService
	) {}

	async collaboratorsNazan(): Promise<Array<CollaboratorsNazanResponse>> {
		try {
			const queryString = collaboratosNazanQuery();
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
				"Ha ocurrido un error en Collaborators Nazan Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async affiliatedKipon(
		data: AffiliatedKiponDTO
	): Promise<Array<AffiliatedKiponResponse>> {
		try {
			const queryString = affiliatedKiponQuery(data);
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
				"Ha ocurrido un error en Affiliated KIPON Club Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}
}
