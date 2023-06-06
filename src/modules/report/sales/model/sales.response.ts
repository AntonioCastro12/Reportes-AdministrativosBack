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
	saleTypeFreight: "Fletes" | null = null;
	@ApiResponseProperty()
	totalMoneyFreight: number | null = null;
	@ApiResponseProperty()
	totalUnitFreight: number | null = null;
	@ApiResponseProperty()
	countInvoiceFreight: number | null = null;
}
