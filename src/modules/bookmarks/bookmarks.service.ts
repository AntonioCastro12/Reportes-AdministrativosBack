import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateFavoriteDTO } from './model/create-favorite.dto';
import { User } from './model/user.model';
import { Favorites } from '@prisma/client';
import { DeleteFavoriteDTO } from './model/delete-favorite.dto';

@Injectable()
export class BookmarksService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) { }

  async createFavorite(data: CreateFavoriteDTO, user: User) {
    const favorite = await this.prismaService.favorites.findFirst({
      where: {
        userId: user.sub,
        url: data.url
      }
    })

    let result: Favorites = null;

    if (favorite) {
      favorite.searchCriteria = data.searchCriteria
      result = await this.prismaService.favorites.update({
        where: {
          id: favorite.id
        },
        data: {
          ...data
        }
      })
    } else {
      result = await this.prismaService.favorites.create({
        data: {
          ...data,
          userId: user.sub
        }
      });
    }
    return result
  }
  async deleteFavorite(data: DeleteFavoriteDTO, user: User) {
    const favorite = await this.prismaService.favorites.findFirst({
      where: {
        userId: user.sub,
        url: data.url
      }
    })

    if (!favorite) {
      const message =
        "Favorito no encontrado";
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.prismaService.favorites.deleteMany({
      where: {
        userId: user.sub,
        url: data.url
      }
    });

    return { success: true, message: "El reporte ha sido removido de favoritos" }
  }

  async getFavorites(user: User) {
    return await this.prismaService.favorites.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        url: true,
        searchCriteria: true
      }
    })
  }

  async getHistoricList(user: User) {
    return await this.prismaService.userSearchCriteria.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        url: true,
        searchCriteria: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}