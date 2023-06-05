import { InventoryComparisonDTO } from "../model/inventories.dto";

export function inventoryComparisonQuery(data: InventoryComparisonDTO) {
	return `
  SELECT

inventoryXStore_productId as productId
,inventoryXStore_storeId as storeId
,IFNULL(inventoryXStore_qty, 0) as xstore_qty
,IFNULL(inventoryXCenter_qty, 0) as xcenter_qty
,IFNULL(inventoryAtg_qty, 0) as atg_qty
,IFNULL(inventoryOB_qty, 0) as orderbroker_qty

FROM InventoryXStore as xstore

LEFT OUTER JOIN InventoryXCenter as xcenter
ON (inventoryXStore_productId = inventoryXCenter_productId
AND inventoryXStore_storeId = inventoryXCenter_storeId)

LEFT OUTER JOIN InventoryAtg as atg
ON (inventoryXStore_productId = CONCAT('000000000000', inventoryAtg_productId)
AND inventoryXStore_storeId = inventoryAtg_storeId)

LEFT OUTER JOIN InventoryOB as orderbroker
ON (inventoryXStore_productId = inventoryOB_productId
AND inventoryXStore_storeId = inventoryOB_storeId)

WHERE inventoryXStore_storeId = '${data.storeId}'

ORDER BY inventoryXStore_productId
  `;
}
