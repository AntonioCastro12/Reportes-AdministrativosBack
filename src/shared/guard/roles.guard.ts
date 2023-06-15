import { HttpService } from "@nestjs/axios";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import axios from "axios";
import * as dotenv from "dotenv";
import { Request } from "express";
import { SsoFetch } from "../model/sso.fetch";

dotenv.config();
@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly httpService: HttpService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<string[]>("roles", context.getHandler());

		if (!roles) {
			return true;
		}

		const codeApp = "reportesadministrativos";
		const hydraUrl = `${process.env.HYDRA_URL}/userinfo`;
		const request = context.switchToHttp().getRequest<Request>();
		const auth_token = request?.headers?.authorization;

		if (!auth_token) {
			return false;
		}

		const result = await this.httpService.axiosRef.post<SsoFetch>(
			hydraUrl,
			{},
			{
				headers: {
					Authorization: auth_token,
				},
			}
		);

		if (
			result.status !== 200 ||
			!result.data.privileges ||
			typeof result.data.privileges !== "object"
		) {
			return false;
		}

		if (result.data.privileges[codeApp]) {
			const roleList = roles[0].split(",");
			if (result.data.privileges[codeApp].some((x) => roleList.includes(x))) {
				return true;
			}
			return false;
		} else {
			return false;
		}
	}
}
