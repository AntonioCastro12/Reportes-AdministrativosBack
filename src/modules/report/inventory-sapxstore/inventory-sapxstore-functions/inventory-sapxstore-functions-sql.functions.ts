export function inventorySapxstoreSqlYearFilter(
  value: string,
  field: string,
): string {
  value = value == 'string' || value == null ? '' : value;

  if (value == '' || !value) {
    return '';
  }
  return `AND ${field} = '${value}'`;
}

export function inventorySapxstoreSqlStoreFilter(
  value: string,
  field: string,
): string {
  value = value == 'string' || value == null ? '' : value;

  if (value == '' || !value) {
    return `AND tienda not IN ('45','93','94','100','205','144','53','82')`;
  }
  return `AND ${field} = '${value}'`;
}

export function inventorySapxstoreSqlLikeFilter(
  value: any,
  field: string,
): string {
  value = value == 'string' || value == 'number' ? '' : value;

  if (value == '' || !value) {
    return '';
  }
  return `AND ${field} LIKE '%${value}%'`;
}
