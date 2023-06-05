import { ValidationPipe } from "./../../../shared/pipes/validation.pipe";
import { InvoiceTotalService } from "./invoice-total.service";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
// import { InvoiceTotalDTO } from "./invoice-total.dto";
@ApiTags("invoice-total")
@Controller("invoice-total")
export class InvoiceTotalController {
	constructor(private invoiceTotalService: InvoiceTotalService) {}

	// @Post()
	// @UsePipes(new ValidationPipe())
	// report(@Body() data: InvoiceTotalDTO) {
	// return this.invoiceTotalService.report(data);
	// }
}
