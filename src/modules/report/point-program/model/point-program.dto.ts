import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TotalMovDTO {
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

export class DetailPointDTO {
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

export class DetailWalletDTO {
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