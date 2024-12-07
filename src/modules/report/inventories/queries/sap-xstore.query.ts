import { mssqlInFilter } from "src/shared/helper/mssql.helper";
import { SapXstoreDTO } from "../model/inventories.dto";

export function sapXstoreQuery(data: SapXstoreDTO) {
	return `
    Use NAZ_MONITOREO_SAP_XSTORE

    SELECT

    tienda as store_id
    ,material as material
    ,anio as year
    ,sap
    ,xstore
    ,diferencia as difference
    ,abs

    
    FROM GNZN_Dif_Comparativo_SAP_XSTORE_resp
    
    WHERE TIENDA NOT IN ('45','93','94','100','205','144','53','82') 
    AND material NOT IN ('16147301','16147401','16147501','16147601','15389601')
    ${mssqlInFilter(data.storeId, "TIENDA")}

    ORDER BY ABS DESC
    `;
}
