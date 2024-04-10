import { ApiResponseProperty } from "@nestjs/swagger";

export class FavoritesResponse {
    @ApiResponseProperty()
    id: number;

    @ApiResponseProperty()
    userId: string;

    @ApiResponseProperty()
    url: string;

    @ApiResponseProperty()
    searchCriteria: {};

    @ApiResponseProperty()
    createdAt: string;

    @ApiResponseProperty()
    updatedAt: string;
}
export class ListFavoritesResponse {
    @ApiResponseProperty()
    url: string;

    @ApiResponseProperty()
    searchCriteria: {};
}

export class ListHistoricReportResponse {
    @ApiResponseProperty()
    url: string;

    @ApiResponseProperty()
    searchCriteria: {};

    @ApiResponseProperty()
    createdAt: string;

    @ApiResponseProperty()
    updatedAt: string;
}

export class DeleteFavoriteResponse {
    @ApiResponseProperty()
    sucess: boolean;

    @ApiResponseProperty()
    message: string;
}