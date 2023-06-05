import { TransactionMonitorDTO } from "./transaction-monitor.dto";
import { ApiTags } from "@nestjs/swagger";
import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { TransactionMonitorService } from "./transaction-monitor.service";
@ApiTags("transaction-monitor")
@Controller("transaction-monitor")
export class TransactionMonitorController {
	constructor(private transactionMonitorService: TransactionMonitorService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	report(@Body() data: TransactionMonitorDTO) {
		// return this.transactionMonitorService.report(data);
	}
}
