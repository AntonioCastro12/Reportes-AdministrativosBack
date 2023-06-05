export class InvoiceTotalResponse {
	saleTypeSale: "Ventas" | "Devoluciones" | "Fletes" | null;
	storeId: string;
	businessDate: string;
	totalMoneySale: number;
	totalUnitSale: number;
	countInvoiceSale: number;
}
