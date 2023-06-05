export function inventoryStockResumeQuery() {
	return `
  USE xstore
  
  SELECT
  MAIN.line
  ,SUM(MAIN.qty) qty

  FROM (
  SELECT
        (select [description]
          from   [itm_merch_hierarchy]
          where  item.merch_level_2 = itm_merch_hierarchy.[hierarchy_id]) line,
          sl_acc.[unitcount]                                         qty

  FROM   [inv_stock_ledger_acct] sl_acc
        left join itm_item item
                on sl_acc.item_id = item.item_id

  WHERE  sl_acc.bucket_id IN ( 'ON_HAND', 'SOBRANTE', 'DEVOLUCIONES', 'LAYAWAY', 'AT_VENDOR', 'INTERMEDIO', 'DAMAGED', 'ORDER' )
  AND sl_acc.[unitcount] != 0

  ) AS MAIN

  GROUP BY MAIN.line
  ORDER BY MAIN.line
`;
}

export function inventoryStockDetailQuery() {
	return `
  USE xstore
  
  SELECT  CASE WHEN (sl_acc.[rtl_loc_id] <= 99) THEN FORMAT(sl_acc.[rtl_loc_id], '00') ELSE FORMAT(sl_acc.[rtl_loc_id], '000') END storeId,
       sl_acc.[item_id]  itemId, isnull(manufacturer_upc,'') sku,
       item.name  description,
          H1.[description] department ,H2.[description] line,  H3.[description] family, H4.[description]  subFamily,
       item.dimension2         size,
       sl_acc.[bucket_id]      block,
       sl_acc.[unitcount]      qty,
       sl_acc.create_date      createDate,
       sl_acc.[update_date]    updateDate,
       sl_acc.update_user_id   userUpdate
  FROM   [inv_stock_ledger_acct] sl_acc
        left join itm_item item on sl_acc.item_id = item.item_id
           left join itm_item_cross_reference xref on( xref.item_id = sl_acc.item_id and primary_flag = 1)
             left join [itm_merch_hierarchy] H1 ON ( item.merch_level_1 = H1.[hierarchy_id])
             left join [itm_merch_hierarchy] H2 ON ( item.merch_level_2 = H2.[hierarchy_id])
             left join [itm_merch_hierarchy] H3 ON ( item.merch_level_3 = H3.[hierarchy_id])
           left join [itm_merch_hierarchy] H4 ON ( item.merch_level_4 = H4.[hierarchy_id])
  WHERE  sl_acc.bucket_id IN ( 'ON_HAND', 'SOBRANTE', 'DEVOLUCIONES', 'LAYAWAY', 'AT_VENDOR', 'INTERMEDIO', 'DAMAGED', 'ORDER' )
  AND sl_acc.[unitcount] != 0  
  ORDER BY sl_acc.[item_id],
           sl_acc.[bucket_id]
  `;
}
