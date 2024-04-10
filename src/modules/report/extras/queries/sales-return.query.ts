import { SalesReturnsMemberDTO } from "../model/extras.dto";

export function salesReturnsByMemberQuery(data: SalesReturnsMemberDTO) {
	return `
    SELECT *
    FROM VenDev_Mensuales
    WHERE CUSTOMER_NUM = '${data.customer_num}'
    `;
}
