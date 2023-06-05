// Vendor
import * as sql from "mssql";

export const xCenterConnectionObject = new sql.ConnectionPool({
	user: process.env.XCENTER_DB_USER_READ_MSSQL,
	password: process.env.XCENTER_DB_PASSWORD_READ_MSSQL,
	server: process.env.XCENTER_DB_HOST_MSSQL,
	port: 1433,
	database: process.env.XCENTER_DB_NAME_MSSQL,
	options: {
		encrypt: false,
		enableArithAbort: false,
		requestTimeout: 300000,
	},
}).config;

export const xhubConnectionObject = new sql.ConnectionPool({
	user: process.env.XHUB_DB_USER_READ_MSSQL,
	password: process.env.XHUB_DB_PASSWORD_READ_MSSQL,
	server: process.env.XHUB_DB_HOST_MSSQL,
	// port: 1433,
	database: process.env.XHUB_DB_NAME_MSSQL,
	options: {
		encrypt: false,
		enableArithAbort: false,
	},
}).config;

export const relateConnectionObject = new sql.ConnectionPool({
	user: process.env.RELATE_DB_USER_READ_MSSQL,
	password: process.env.RELATE_DB_PASSWORD_READ_MSSQL,
	server: process.env.RELATE_DB_HOST_MSSQL,
	// port: 1433,
	database: process.env.RELATE_DB_NAME_MSSQL,
	options: {
		encrypt: false,
		enableArithAbort: false,
	},
}).config;
