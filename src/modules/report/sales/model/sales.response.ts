import { ApiResponseProperty } from "@nestjs/swagger";

export class InvoiceTotalResponse {
	@ApiResponseProperty()
	storeId: string | null = null;
	@ApiResponseProperty()
	businessDate: string | null = null;
	@ApiResponseProperty()
	saleTypeSale: "Ventas" | null = null;
	@ApiResponseProperty()
	totalMoneySale: number | null = null;
	@ApiResponseProperty()
	totalUnitSale: number | null = null;
	@ApiResponseProperty()
	countInvoiceSale: number | null = null;
	@ApiResponseProperty()
	saleTypeReturn: "Devoluciones" | null = null;
	@ApiResponseProperty()
	totalMoneyReturn: number | null = null;
	@ApiResponseProperty()
	totalUnitReturn: number | null = null;
	@ApiResponseProperty()
	countInvoiceReturn: number | null = null;
	@ApiResponseProperty()
	unitPercentReturn: number | null = null;
	@ApiResponseProperty()
	totalPercentReturn: number | null = null;
	@ApiResponseProperty()
	saleTypeFreight: "Fletes" | null = null;
	@ApiResponseProperty()
	totalMoneyFreight: number | null = null;
	@ApiResponseProperty()
	totalUnitFreight: number | null = null;
	@ApiResponseProperty()
	countInvoiceFreight: number | null = null;
}

export class GeneralSalesBodyResponse {
	@ApiResponseProperty()
	name: string;
	@ApiResponseProperty()
	data: Array<GeneralSalesDataResponse>;
}

export class GeneralSalesDataResponse {
	@ApiResponseProperty()
	titleLine: string;
	@ApiResponseProperty()
	countTransactions: number;
	@ApiResponseProperty()
	totalMoney: number;
}

export class GeneralSalesResponse {
	@ApiResponseProperty()
	sales: GeneralSalesBodyResponse;
	@ApiResponseProperty()
	paymentMethod: GeneralSalesBodyResponse;
}

export class WholesaleSalesResponse {
	@ApiResponseProperty()
	Tienda: number;
	@ApiResponseProperty()
	Fecha: string;
	@ApiResponseProperty()
	Num_Colaborador: string;
	@ApiResponseProperty()
	Colaborador: string;
	@ApiResponseProperty()
	Transacciones_Totales: number;
	@ApiResponseProperty()
	Total_Pares: number;
	@ApiResponseProperty()
	Transacciones_1_Par: number;
	@ApiResponseProperty()
	Transacciones_2_Par: number;
	@ApiResponseProperty()
	Transacciones_3_o_Mas_Par: number;
	@ApiResponseProperty()
	Mayoreos: number;
}
