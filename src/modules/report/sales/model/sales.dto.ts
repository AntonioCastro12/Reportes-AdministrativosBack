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
		example: "2021-01-01",
		required: true,
	})
	@IsString()
	startDate: string;

	@ApiProperty({
		name: "endDate",
		description: "End date",
		example: "2021-01-01",
		required: true,
	})
	@IsString()
	endDate: string;
}

export class GeneralSalesDTO {
	@ApiProperty({
		name: "storeId",
		description: "Store Id",
		required: true,
	})
	@IsString()
	storeId: string;

	@ApiProperty({
		name: "businessDate",
		description: "Business date",
		example: "2021-01-01",
		required: true,
	})
	@IsString()
	businessDate: string;
}

export class WholesaleSalesDTO {
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
		example: "2021-01-01",
		required: true,
	})
	@IsString()
	startDate: string;

	@ApiProperty({
		name: "endDate",
		description: "End date",
		example: "2021-01-01",
		required: true,
	})
	@IsString()
	endDate: string;
}