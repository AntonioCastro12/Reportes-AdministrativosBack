import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

// Aux
import { AppModule } from "./app.module";
// import { CachingStoreProvider } from './providers/catching-store/caching-store.provider';
import { VERSION } from "src/environments/version";

// Vendor
import { HttpExceptionFilter } from "./shared/filter/http-exception.filter";
import * as compression from "compression";

async function bootstrap() {
	const title = "Administration-REPORTS";
	const description = `NazanAdministration-REPORTS - VERSION: ${VERSION.version} - GIT: ${VERSION.suffix}`;
	const version = `${VERSION.version}`;

	console.log(description);

	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.setGlobalPrefix("api");
	app.useGlobalFilters(new HttpExceptionFilter());
	app.use(compression());

	const options = new DocumentBuilder()
		.setTitle(title)
		.setDescription(description)
		.setVersion(version)
		.build();

	const document = SwaggerModule.createDocument(app, options);

	if (process.env.NODE_ENV === "development") {
		SwaggerModule.setup("explorer", app, document);
	}

	const server = await app.listen(process.env.DEFAULT_PORT || 3151);
	server.setTimeout(1800000);
}
bootstrap();
