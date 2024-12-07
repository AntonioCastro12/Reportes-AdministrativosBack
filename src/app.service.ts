import { Inject, Injectable } from "@nestjs/common";

import { VERSION } from "src/environments/version";

@Injectable()
export class AppService {
	async getGitVersion() {
		return VERSION;
	}
}
