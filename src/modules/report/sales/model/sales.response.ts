export class InvoiceTotalSalesResponse {
	salesTypeSales: "Ventas" | null;
	storeId: string | null;
	businessDate: string | null;
	totalMoneySales: number | null;
	totalUnitSales: number | null;
	countInvoiceSales: number | null;
}

export class InvoiceTotalReturnResponse {
	saleTypeReturn: "Devoluciones" | null;
	storeId: string | null;
	businessDate: string | null;
	totalMoneyReturn: number | null;
	totalUnitReturn: number | null;
	countInvoiceReturn: number | null;
}

export class InvoiceTotalFreightResponse {
	saleTypeFreight: "Flete" | null;
	storeId: string | null;
	businessDate: string | null;
	totalMoneyFreight: number | null;
	totalUnitFreight: number | null;
	countInvoiceFreight: number | null;
}
