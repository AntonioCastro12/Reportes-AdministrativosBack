import { Body, Controller, Delete, Get, Post, Request, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guard/roles.guard';
import { HistoryInterceptor } from 'src/shared/interceptors/history.interceptor';
import { BookmarksService } from './bookmarks.service';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { InvoiceTotalResponse } from '../report/sales/model/sales.response';
import { InternalServerErrorResponse } from 'src/shared/filter/models/http-errors.response';
import { DeleteFavoriteResponse, FavoritesResponse, ListFavoritesResponse, ListHistoricReportResponse } from './model/favorites.response';
import { CreateFavoriteDTO } from './model/create-favorite.dto';
import { DeleteFavoriteDTO } from './model/delete-favorite.dto';

@ApiTags("bookmarks")
@Controller("bookmarks")
@UseGuards(RoleGuard)
@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarkService: BookmarksService) { }

    @Post("favorites")
    @Roles("staff-ingresos,sistemas")
    @ApiOperation({
        summary: "Crear o actualizar favorito",
    })
    @ApiResponse({
        type: FavoritesResponse,
        description: `create or edit favorite`,
        status: 200,
        isArray: false,
    })
    @ApiResponse({
        type: InternalServerErrorResponse,
        status: 500,
        description: "Error response",
    })
    createFavorite(@Body(new ValidationPipe()) data: CreateFavoriteDTO, @Request() req: any) {
        return this.bookmarkService.createFavorite(data, req.user);
    }

    @Delete("favorites")
    @Roles("staff-ingresos,sistemas")
    @ApiOperation({
        summary: "Crear o actualizar favorito",
    })
    @ApiResponse({
        type: DeleteFavoriteResponse,
        description: `create or edit favorite`,
        status: 200,
        isArray: false,
    })
    @ApiResponse({
        type: InternalServerErrorResponse,
        status: 500,
        description: "Error response",
    })
    deleteFavorite(@Body(new ValidationPipe()) data: DeleteFavoriteDTO, @Request() req: any) {
        return this.bookmarkService.deleteFavorite(data, req.user);
    }

    @Get("favorites")
    @Roles("staff-ingresos,sistemas")
    @ApiOperation({
        summary: "listado de reportes favoritos",
    })
    @ApiResponse({
        type: ListFavoritesResponse,
        description: `reports favorites list`,
        status: 200,
        isArray: true,
    })
    @ApiResponse({
        type: InternalServerErrorResponse,
        status: 500,
        description: "Error response",
    })
    getFavorites(@Request() req: any) {
        return this.bookmarkService.getFavorites(req.user);
    }

    @Get("historic")
    @Roles("staff-ingresos,sistemas")
    @ApiOperation({
        summary: "listado de reportes consultados",
    })
    @ApiResponse({
        type: ListHistoricReportResponse,
        description: `reports historic list`,
        status: 200,
        isArray: true,
    })
    @ApiResponse({
        type: InternalServerErrorResponse,
        status: 500,
        description: "Error response",
    })
    getHistoricReports(@Request() req: any) {
        return this.bookmarkService.getHistoricList(req.user);
    }
}