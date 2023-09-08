export function mssqlFilter(value: string, field: string): string {
	const newValue = value.toLowerCase();

	if (newValue === "todas") {
		return "";
	}
	return `AND ${field} = '${value}'`;
}

export function mssqlInFilter(value: string, field: string): string {
	const newValue = value.split(',').map(item => `'${item}'`).join(',');
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
