import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CollaboratorsNazanDTO {
	@ApiProperty({
		name: "segmentId",
		description: "Segment number",
		required: true,
	})
	@IsString()
	segmentId: string;
}

export class AffiliatedKiponDTO {
	@ApiProperty({
		name: "storeId",
		type: String,
		required: true,
		description: "Store ID",
	})
	storeId: string;

	@ApiProperty({
		name: "startDate",
		type: String,
		required: true,
		description: "Start date",
		example: "2021-01-01",
	})
	startDate: string;

	@ApiProperty({
		name: "endDate",
		type: String,
		required: true,
		description: "End date",
		example: "2021-01-01",
	})
	endDate: string;
}
