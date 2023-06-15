export function mssqlFilter(value: string, field: string): string {
	const newValue = value.toLowerCase();

	if (newValue === "todas") {
		return "";
	}
	return `AND ${field} = '${value}'`;
}

export function mssqlLikeFilter(value: any, field: string): string {
	value = value === "string" || value == null ? "" : value;

	if (value == "" || !value) {
		return "";
	}
	return `AND ${field} LIKE '%${value}%'`;
}
