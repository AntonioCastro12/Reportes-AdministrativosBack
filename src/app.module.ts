import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
// Local
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// Vendor

// Custom
import { HttpErrorFilter } from "src/shared/helper/http-error.filter";

import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { InventoriesModule } from "./modules/report/inventories/inventories.module";
import { SegmentsModule } from "./modules/report/segments/segments.module";
import { SalesModule } from "./modules/report/sales/sales.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env`,
			isGlobal: true,
			load: [configuration],
		}),
		InventoriesModule,
		SalesModule,
		SegmentsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: HttpErrorFilter,
		},
	],
})
export class AppModule {}
