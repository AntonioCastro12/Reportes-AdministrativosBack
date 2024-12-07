import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class DeleteFavoriteDTO {
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
