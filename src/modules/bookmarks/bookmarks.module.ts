import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BookmarksController],
  providers: [
    BookmarksService,
    PrismaService,
  ],
})
export class BookmarksModule { }
