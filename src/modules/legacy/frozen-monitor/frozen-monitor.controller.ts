import { ApiTags } from "@nestjs/swagger";
import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { FrozenMonitorService } from "./frozen-monitor.service";
import { FrozenMonitorDTO } from "./frozen-monitor.dto";
@ApiTags("frozen-monitor")
@Controller("frozen-monitor")
export class FrozenMonitorController {
	constructor(private frozenMonitorService: FrozenMonitorService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	report(@Body() data: FrozenMonitorDTO) {
		// return this.frozenMonitorService.report(data);
	}
}
