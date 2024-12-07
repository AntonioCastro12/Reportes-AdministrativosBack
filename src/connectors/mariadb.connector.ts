import * as mysql from "mysql2/promise";

export async function localMariaDb() {
	const configPool = {
		host: process.env.REPORTS_DB_HOST,
		user: process.env.REPORTS_DB_USER_WRITE,
		password: process.env.REPORTS_DB_PASSWORD_WRITE,
		database: process.env.REPORTS_DB_NAME,
		connectionLimit: 10,
		connectTimeout: 60 * 60 * 1000,
		multipleStatements: true,
		timezone: "-04:00",
		dateStrings: true,
		port: parseInt(process.env.DATABASE_PORT),
	};

	const mariadbPool = mysql.createPool(configPool);

	return mariadbPool;
}
