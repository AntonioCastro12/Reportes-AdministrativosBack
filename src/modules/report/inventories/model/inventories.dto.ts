import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class KardexProductDTO {
	@ApiProperty({
		name: "storeId",
		description: "Store Id",
		required: true,
	})
	@IsString()
	storeId: string;

	@ApiProperty({
		name: "productId",
		description: "Product Id",
		required: true,
	})
	@IsString()
	productId: string;

	@ApiProperty({
		enum: ["xstore", "xcenter"],
		enumName: "Origin",
		name: "origin",
		description: "Origin of the query",
		required: true,
	})
	@IsString()
	origin: Origin;

	@ApiProperty({
		name: "startDate",
		description: "Start date",
		required: true,
		example: "2021-03-01",
	})
	@IsString()
	startDate: string;

	@ApiProperty({
		name: "endDate",
		description: "End date",
		required: true,
		example: "2021-03-01",
	})
	@IsString()
	endDate: string;
}

export enum Origin {
	xstore = "xstore",
	xcenter = "xcenter",
}

export class InventoryStockDTO {
	@ApiProperty({
		name: "storeId",
		description: "Store Id",
		required: true,
	})
	@IsString()
	storeId: string;
}

export class InventoryComparisonDTO {
	@ApiProperty({
		name: "storeId",
		description: "Store Id",
		required: true,
	})
	@IsString()
	storeId: string;
}

export class PODDTO {
	@ApiProperty({
		name: "days",
		description: "Days",
		required: true,
	})
	@IsNumber()
	days: number;
}
