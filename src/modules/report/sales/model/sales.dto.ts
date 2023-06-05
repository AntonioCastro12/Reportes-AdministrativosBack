import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InvoiceTotalDTO {
	@ApiProperty({
		name: "storeId",
		description: "Store Id",
		required: true,
	})
	@IsString()
	storeId: string;

	@ApiProperty({
		name: "startDate",
		description: "Start date",
		required: true,
	})
	@IsString()
	startDate: string;

	@ApiProperty({
		name: "endDate",
		description: "End date",
		required: true,
	})
	@IsString()
	endDate: string;
}
