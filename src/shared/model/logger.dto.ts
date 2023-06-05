export class LogguerServiceDTO {
	level: LogOptions;
	message: string;
	stacktrace?: string;
	context?: object;
}

export enum LogOptions {
	log = "log",
	error = "error",
	warn = "warn",
	verbose = "verbose",
	debug = "debug",
}
