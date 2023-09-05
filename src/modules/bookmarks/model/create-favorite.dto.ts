import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateFavoriteDTO {
    @ApiProperty({
        name: "searchCriteria",
        description: "object search criteria",
        required: true,
        example: "{startDate:'2021-01-01', endDate:'2021-01-01'}",
    })
    @IsNotEmpty()
    @IsObject()
    searchCriteria: string;

    @ApiProperty({
        name: "url",
        description: "url report",
        required: true,
        example: "/inventory/example",
    })
    @IsNotEmpty()
    @IsString()
    url: string;
}
