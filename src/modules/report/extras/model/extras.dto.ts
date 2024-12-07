import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SalesReturnsMemberDTO {
	@ApiProperty({
		name: "customer_num",
		description: "Numero de Socio",
		required: true,
		format: "string",
	})
	@IsNotEmpty({
		message: "Debe enviar un número de socio en la solicitud",
	})
	customer_num: string;
}
