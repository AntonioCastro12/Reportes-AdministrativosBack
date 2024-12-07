import { Controller, Get, UsePipes } from "@nestjs/common";
import { AppService } from "./app.service";

import { ValidationPipe } from "src/shared/pipes/validation.pipe";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get("version")
	@UsePipes(new ValidationPipe())
	getVersion() {
		return this.appService.getGitVersion();
	}
}
