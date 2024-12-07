import { ApiResponseProperty } from "@nestjs/swagger";

export class TotalMovResponse {
	@ApiResponseProperty()
	NUM_SOCIO: string;
	@ApiResponseProperty()
	NOM_CORTO: string;
	@ApiResponseProperty()
	NOMBRE_SOCIO: string;
	@ApiResponseProperty()
	NIVEL: string;
	@ApiResponseProperty()
	PUNTOS_OTROGADOS: number;
	@ApiResponseProperty()
	TIENDA: number;
	@ApiResponseProperty()
	TRANSACCION: number;
	@ApiResponseProperty()
	CAJA: number;
	@ApiResponseProperty()
	FECHA_ACTIVIDAD: string;
	@ApiResponseProperty()
	ACTIVIDAD: string;
}

export class DetailPointResponse {
	@ApiResponseProperty()
	NUM_SOCIO: string;
	@ApiResponseProperty()
	NOM_CORTO: string;
	@ApiResponseProperty()
	NOMBRE_SOCIO: string;
	@ApiResponseProperty()
	NIVEL: string;
	@ApiResponseProperty()
	PUNTOS_OTROGADOS: number;
	@ApiResponseProperty()
	TIENDA: number;
	@ApiResponseProperty()
	TRANSACCION: number;
	@ApiResponseProperty()
	CAJA: number;
	@ApiResponseProperty()
	FECHA_ACTIVIDAD: string;
	@ApiResponseProperty()
	ACTIVIDAD: string;
}

export class DetailWalletResponse {
	@ApiResponseProperty()
	NUM_SOCIO: string;
	@ApiResponseProperty()
	NOM_CORTO: string;
	@ApiResponseProperty()
	NOMBRE_SOCIO: string;
	@ApiResponseProperty()
	NIVEL: string;
	@ApiResponseProperty()
	PUNTOS_OTROGADOS: number;
	@ApiResponseProperty()
	TIENDA: number;
	@ApiResponseProperty()
	TRANSACCION: number;
	@ApiResponseProperty()
	CAJA: number;
	@ApiResponseProperty()
	FECHA_ACTIVIDAD: string;
	@ApiResponseProperty()
	ACTIVIDAD: string;
}
