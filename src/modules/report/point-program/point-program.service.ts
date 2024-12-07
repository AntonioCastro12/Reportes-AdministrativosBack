import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConnectionByStoreService } from "src/shared/services/connection-by-store.service";
import { LoggerSystemService } from "src/shared/services/logger.service";
import * as sql from "mssql";
import { LogOptions } from "src/shared/model/logger.dto";
import { relateConnectionObject } from "src/connectors/mssql.connector";
import {
	DetailPointDTO,
	DetailWalletDTO,
	TotalMovDTO,
} from "./model/point-program.dto";
import { totalMovementQuery } from "./queries/total-movement.query";
import {
	DetailWalletResponse,
	TotalMovResponse,
} from "./model/point-program.response";
import { detailPointsQuery } from "./queries/detail-points.query";
import { detailWalletQuery } from "./queries/detail-wallet.query";

@Injectable()
export class PointProgramService {
	constructor(
		private readonly connectionByStoreService: ConnectionByStoreService,
		private readonly loggerSystemService: LoggerSystemService
	) {}

	async totalMovement(data: TotalMovDTO): Promise<Array<TotalMovResponse>> {
		try {
			const queryString = totalMovementQuery(data);
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
				"Ha ocurrido un error en Total Movements Points & Wallet Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async detailPoints(data: DetailPointDTO) {
		try {
			const queryString = detailPointsQuery(data);
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
				"Ha ocurrido un error en Detail Points & Rewards Movements Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}

	async detailWallet(
		data: DetailWalletDTO
	): Promise<Array<DetailWalletResponse>> {
		try {
			const queryString = detailWalletQuery(data);
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
				"Ha ocurrido un error en Detail Wallet Movements Report: " +
				(error.message || error.name);
			throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			await sql.close();
		}
	}
}
