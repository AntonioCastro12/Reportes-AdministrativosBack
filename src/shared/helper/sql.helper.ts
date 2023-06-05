export function sqlFilter(value: string, field: string): string {
  value = value == 'string' ? '' : value;

  if (value == '' || !value) {
    return 'AND 1';
  }
  return `AND ${field} = '${value}'`;
}

export function sqlDateFunction(userSelection: any, field: string): string {
  let fechaInicio = userSelection.fecha_inicio;
  let fechaFinal = userSelection.fecha_final;

  fechaInicio = fechaInicio == 'string' ? '' : fechaInicio;
  fechaFinal = fechaFinal == 'string' ? '' : fechaFinal;

  if (fechaInicio == '' && fechaFinal == '') {
    return `AND (${field} BETWEEN DATE(NOW()) AND DATE(NOW()))`;
  } else if (fechaInicio !== '' && fechaFinal == '') {
    return `AND (${field} BETWEEN '${fechaInicio}' AND '${fechaInicio}')`;
  } else if (fechaInicio == '' && fechaFinal !== '') {
    return `AND (${field} BETWEEN '${fechaFinal}' AND '${fechaFinal}')`;
  } else if (!fechaInicio || !fechaFinal) {
    return `AND 1`;
  } else {
    return `AND (${field} BETWEEN '${fechaInicio}' AND '${fechaFinal}')`;
  }
}

export function sqlLikeFilter(value: string, field: string): string {
  value = value == 'string' ? '' : value;

  if (value == '' || !value) {
    return 'AND 1';
  }
  return `AND ${field} LIKE '%${value}%'`;
}
