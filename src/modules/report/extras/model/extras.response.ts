import { ApiResponse, ApiResponseProperty } from "@nestjs/swagger";

export class SalesReturnsResponse {
	@ApiResponseProperty()
	CUST_ID: string;
	@ApiResponseProperty()
	CUSTOMER_NUM: string;
	@ApiResponseProperty()
	MES: string;
	@ApiResponseProperty()
	VENTAS: number;
	@ApiResponseProperty()
	DEVOLUCIONES: number;
}
