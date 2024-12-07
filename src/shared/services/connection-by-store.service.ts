import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { StoreConnFetch } from "src/shared/model/shared.fetch";
import * as axios from "axios";
import { LogOptions } from "../model/logger.dto";
import { LoggerSystemService } from "./logger.service";
import * as sql from "mssql";

export
@Injectable()
class ConnectionByStoreService {
	private readonly utilityUrl: string;

	constructor(
		private readonly httpService: HttpService,
		private configService: ConfigService,
		private loggerSystemService: LoggerSystemService
	) {
		this.utilityUrl = this.configService.get<string>("utilityUrl");
	}

	async xstoreConnection(storeId: string) {
		try {
			const storeParams = await this.httpService.axiosRef.get<StoreConnFetch>(
				`${this.utilityUrl}/api/store-conn/${storeId}`
			);

			const connectionObject = new sql.ConnectionPool({
				user: storeParams.data.storeConnUser,
				password: storeParams.data.storeConnPassword,
				server: storeParams.data.storeConnIpAddress,
				port: parseInt(storeParams.data.storeConnPort),
				database: storeParams.data.storeConnStoreDatabase,
				connectionTimeout: 30000000,
				requestTimeout: 30000000,
				options: {
					encrypt: false,
					enableArithAbort: false,
				},
			}).config;

			return connectionObject;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError: axios.AxiosError = error;
				this.loggerSystemService.create({
					level: LogOptions.error,
					message: axiosError.message,
					stacktrace: JSON.stringify(axiosError.stack),
				});
				const message = `${axiosError.response.statusText},${axiosError.response.data}`;
				throw new HttpException(message, axiosError.response.status);
			} else {
				this.loggerSystemService.create({
					level: LogOptions.error,
					message: error.message,
				});
				const message = `INTERNAL_SERVER_ERROR,${error.message}`;
				throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}
}
