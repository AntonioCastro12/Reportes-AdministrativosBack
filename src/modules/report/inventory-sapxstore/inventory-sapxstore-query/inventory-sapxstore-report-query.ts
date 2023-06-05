import {
  inventorySapxstoreSqlLikeFilter,
  inventorySapxstoreSqlStoreFilter,
  inventorySapxstoreSqlYearFilter,
} from '../inventory-sapxstore-functions/inventory-sapxstore-functions-sql.functions';
import { InventorySapxstoreDTO } from './../inventory-sapxstore.dto';

export function inventorySapxstoreReportQuery(data: InventorySapxstoreDTO) {
  return /*sql*/ `
  SELECT

CASE WHEN (tienda <= 99) THEN FORMAT(tienda, '00') ELSE FORMAT(tienda, '000') END storeId
,material product
,anio year
,SAP sapQty
,XSTORE xstoreQty
,diferencia difference
,ABS abs

FROM GNZN_Dif_Comparativo_SAP_XSTORE_resp

WHERE 1 = 1

-- tienda
${inventorySapxstoreSqlStoreFilter(data.storeInfoId, 'tienda')}

-- year
${inventorySapxstoreSqlYearFilter(data.year, 'anio')}

-- product
${inventorySapxstoreSqlLikeFilter(data.productId, 'material')}
  `;
}
