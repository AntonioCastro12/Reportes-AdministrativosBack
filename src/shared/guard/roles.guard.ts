import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<string[]>("roles", context.getHandler());

		let result;
		// console.log(roles, 'roles');

		if (!roles) {
			return true;
		}

		const codeApp = "prenomina";
		const hydraUrl = `${process.env.HYDRA_URL}/userinfo`;
		const request = context.switchToHttp().getRequest();
		// console.log(request.body, 'body');
		const post = request.query;
		// console.log({ post });

		if (!post.auth_token) {
			return false;
		}

		result = await axios({
			method: "post",
			url: hydraUrl,
			headers: {
				Authorization: "Bearer " + post.auth_token,
			},
		});

		// console.log(result.data, 'result');
		// console.log(result.data, 'data');
		// console.log(result.privileges, 'privileges');
		if (!result || !result.data || !result.data.privileges) {
			return false;
		}
		// console.log(result.data, 'result');

		const Privileges = result.data.privileges;
		// console.log(Privileges, 'Privileges');

		if (typeof Privileges !== "object") {
			return false;
		}

		let Authorization = false;
		if (roles) {
			Object.entries(roles).forEach((x) => {
				if (Authorization) return;
				let role: any = x[1];

				typeof role === "string" && (role = role.split(","));
				// console.log(role, 'role ++');
				if (Privileges[codeApp]) {
					if (role.includes("*")) {
						Authorization = true;
					} else {
						if (Privileges[codeApp].some((x) => role.includes(x))) {
							Authorization = true;
						}
					}
				}
			});
		} else {
			//TODO: no se requieren permisos
			Authorization = true;
		}

		if (!Authorization) {
			return false;
		}

		if (Privileges[codeApp].some((x) => x === "todas-las-tiendas")) {
			return true;
		} else if (
			Privileges[codeApp].some((x) => x === "tienda-asignada") ||
			Privileges[codeApp].some((x) => x === "prenomina-status")
		) {
			if (request.body.prePayrollApproveState) {
				const decimal = "0";
				let store: string = result.data.tienda;
				store.length < 2 ? (store = decimal.concat(store)) : store;
				request.body.prePayrollApproveStoreId = store;
				request.body.prePayrollApproveUser = result.data.nombre;
				return true;
			} else if (request.body.employeeToolStoreId) {
				const decimal = "0";
				let store: string = result.data.tienda;
				store.length < 2 ? (store = decimal.concat(store)) : store;
				request.body.employeeToolStoreId = store;
				return true;
			} else {
				const decimal = "0";
				let store: string = result.data.tienda;
				store.length < 2 ? (store = decimal.concat(store)) : store;
				request.body.storeInfoId = store;
				return true;
			}
		}
	}
}
