import { SalesInfoService } from "./sales-info.service";
import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SalesInfoDTO } from "./sales-info.dto";
@ApiTags("sales-info")
@Controller("sales-info")
export class SalesInfoController {
	constructor(private salesInfoService: SalesInfoService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	report(@Body() data: SalesInfoDTO) {
		// return this.salesInfoService.report(data);
	}
}
