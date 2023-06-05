import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
// Local
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// Vendor

// Custom
import { HttpErrorFilter } from "src/shared/helper/http-error.filter";

// Sales
import { SalesInfoModule } from "./modules/report/sales-info/sales-info.module";
import { InvoiceTotalModule } from "./modules/report/invoice-total/invoice-total.module";
// Systems
import { InventorySapxstoreModule } from "./modules/report/inventory-sapxstore/inventory-sapxstore.module";
// Legacy
import { TransactionMonitorModule } from "./modules/legacy/transaction-monitor/transaction-monitor.module";
import { FrozenMonitorModule } from "./modules/legacy/frozen-monitor/frozen-monitor.module";
import { ShippingListModule } from "./modules/legacy/shipping-list/shipping-list.module";
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
		// Sales
		InvoiceTotalModule,
		SalesInfoModule,
		// Systems
		InventorySapxstoreModule,
		// Legacy
		ShippingListModule,
		TransactionMonitorModule,
		FrozenMonitorModule,
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
