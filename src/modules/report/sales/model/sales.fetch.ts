export class InvoiceTotalFetch {
	storeId: string | null = null;
	businessDate: string | null = null;
	saleTypeSale: "Ventas" | null = null;
	totalMoneySale: number | null = null;
	totalUnitSale: number | null = null;
	countInvoiceSale: number | null = null;
	saleTypeReturn: "Devoluciones" | null = null;
	totalMoneyReturn: number | null = null;
	totalUnitReturn: number | null = null;
	countInvoiceReturn: number | null = null;
	saleTypeFreight: "Fletes" | null = null;
	totalMoneyFreight: number | null = null;
	totalUnitFreight: number | null = null;
	countInvoiceFreight: number | null = null;
}
