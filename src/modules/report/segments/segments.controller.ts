import {
	Controller,
	Get,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { SegmentsService } from "./segments.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
	AffiliatedKiponDTO,
	CollaboratorsNazanDTO,
} from "./model/segments.dto";
import { InternalServerErrorResponse } from "src/shared/filter/models/http-errors.response";
import {
	AffiliatedKiponResponse,
	CollaboratorsNazanResponse,
} from "./model/segments.response";
import { Roles } from "src/shared/decorator/roles.decorator";
import { HistoryInterceptor } from "src/shared/interceptors/history.interceptor";
import { RoleGuard } from "src/shared/guard/roles.guard";

@ApiTags("segments")
@Controller("segments")
@UseInterceptors(HistoryInterceptor)
@UseGuards(RoleGuard)
export class SegmentsController {
	constructor(private readonly segmentsService: SegmentsService) {}

	@Get("collaborators-nazan")
	@Roles("staff-menudeo,sistemas,staff-mayoreo")
	@ApiOperation({ summary: "Segmento Colaboradores Nazan" })
	@ApiResponse({
		type: CollaboratorsNazanResponse,
		description: `Collaborators Nazan Report`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	collaboratorsNazan() {
		return this.segmentsService.collaboratorsNazan();
	}

	@Get("affiliated-kipon")
	@Roles("staff-kipon,sistemas,tienda,staff-menudeo")
	@ApiOperation({ summary: "Afiliados Club KIPON" })
	@ApiResponse({
		type: AffiliatedKiponResponse,
		description: `Affiliated Club KIPON Report`,
		status: 200,
		isArray: true,
	})
	@ApiResponse({
		type: InternalServerErrorResponse,
		status: 500,
		description: "Error response",
	})
	affiliatedKipon(@Query() data: AffiliatedKiponDTO) {
		return this.segmentsService.affiliatedKipon(data);
	}
}
