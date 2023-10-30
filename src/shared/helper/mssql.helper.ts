export function mssqlStoreFilter(value: string[], field: string): string {
	if (value.length == 0) {
		return "";
	}
	if (value.length > 0) {
		const newValue = value.map((x) => `'${x}'`).join(",");
		console.log({ newValue });
		return `AND ${field} IN (${newValue})`;
	}
}

export function mssqlFilter(value: string, field: string): string {
	if (value.length == 0) {
		return "";
	}
	if (value.length > 0) {
		// const newValue = value.map((x) => `"${x}"`).join(",");
		return `AND ${field} IN (${value})`;
	}
}

export function mssqlInFilter(value: string, field: string): string {
	const newValue = value
		.split(",")
		.map((item) => `${item}`)
		.join(",");

	return `AND ${field} in (${newValue})`;
}

export function mssqlLikeFilter(value: any, field: string): string {
	value = value === "string" || value == null ? "" : value;

	if (value == "" || !value) {
		return "";
	}
	return `AND ${field} LIKE '%${value}%'`;
}

export function stringDateFormat(value: string): string {
	return value.replace(/-/g, "");
}
