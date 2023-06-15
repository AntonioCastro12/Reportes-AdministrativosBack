import { ApiResponseProperty } from "@nestjs/swagger";

export class KardexProductResponse {
	@ApiResponseProperty()
	store_id: number | null;
	@ApiResponseProperty()
	trans_seq: string | null;
	@ApiResponseProperty()
	ws_id: string | null;
	@ApiResponseProperty()
	create_date: string | null;
	@ApiResponseProperty()
	origin_bucket: string | null;
	@ApiResponseProperty()
	destiny_bucket: string | null;
	@ApiResponseProperty()
	action_code: string | null;
	@ApiResponseProperty()
	item_id: string | null;
	@ApiResponseProperty()
	description: string | null;
	@ApiResponseProperty()
	document: string | null;
	@ApiResponseProperty()
	qty: number | null;
	@ApiResponseProperty()
	on_hand: number | null;
	@ApiResponseProperty()
	time_trans: string | null;
	@ApiResponseProperty()
	on_order: number | null;
}

export class InventoryStockResumeResponse {
	@ApiResponseProperty()
	line: string;
	@ApiResponseProperty()
	qty: number;
}

export class InventoryStockDetailResponse {
	@ApiResponseProperty()
	storeId: string;
	@ApiResponseProperty()
	itemId: string;
	@ApiResponseProperty()
	sku: string;
	@ApiResponseProperty()
	description: string;
	@ApiResponseProperty()
	department: string;
	@ApiResponseProperty()
	line: string;
	@ApiResponseProperty()
	family: string;
	@ApiResponseProperty()
	subFamily: string;
	@ApiResponseProperty()
	size: string;
	@ApiResponseProperty()
	block: string;
	@ApiResponseProperty()
	qty: number;
	@ApiResponseProperty()
	createDate: string;
	@ApiResponseProperty()
	updateDate: string;
	@ApiResponseProperty()
	userUpdate: string;
}

export class InventoryComparisonResponse {
	@ApiResponseProperty()
	productId: string;
	@ApiResponseProperty()
	storeId: string;
	@ApiResponseProperty()
	xstore_qty: string;
	@ApiResponseProperty()
	xcenter_qty: string;
	@ApiResponseProperty()
	atg_qty: string;
	@ApiResponseProperty()
	orderbroker_qty: string;
}

export class DifferenceSapXstore {
	@ApiResponseProperty()
	store_id: number | null;
	@ApiResponseProperty()
	material: string | null;
	@ApiResponseProperty()
	year: number | null;
	@ApiResponseProperty()
	sap: number | null;
	@ApiResponseProperty()
	xstore: number | null;
	@ApiResponseProperty()
	difference: number | null;
	@ApiResponseProperty()
	abs: number | null;
}

export class PODResponse {
	@ApiResponseProperty()
	T_ORIGEN: string;
	@ApiResponseProperty()
	NOMBRE_TDA_ORIGEN: string;
	@ApiResponseProperty()
	T_DESTINO: number;
	@ApiResponseProperty()
	L_EMBARQUE: string;
	@ApiResponseProperty()
	TIPO_EMBARQUE: string;
	@ApiResponseProperty()
	FEC_CREA_SISTEMA: string;
	@ApiResponseProperty()
	FEC_HORA_POD: string;
	@ApiResponseProperty()
	FEC_HORA_CIERRE: string;
	@ApiResponseProperty()
	TIEMPO_HRS: number;
	@ApiResponseProperty()
	ESTATUS: string;
}
