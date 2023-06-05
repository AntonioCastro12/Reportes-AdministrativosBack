import { KardexProductDTO, Origin } from "../model/inventories.dto";

export function kardexProductQuery(data: KardexProductDTO) {
	let useDatabase =
		data.origin == Origin.xcenter ? "NAZ_XCENTER_PROD" : "xstore";

	return `
  USE ${useDatabase}
 
SELECT 

  INV_J.[rtl_loc_id] as store_id
	,INV_J.trans_seq as trans_seq
	,INV_J.wkstn_id as ws_id
  ,inv_j.create_date as create_date
	,inv_j.source_bucket_id as origin_bucket
	,inv_j.dest_bucket_id as destiny_bucket
	,inv_j.action_code as action_code
	,inv_j.[inventory_item_id] as item_id

	,(select name 
    from [itm_item] (nolock) 
	     where itm_item.organization_id = 1001 
       and itm_item.item_id = INV_J.[inventory_item_id]) as description

  ,(select invctl_document_id 
    from inv_invctl_trans as trn_hdr
			where INV_J.organization_id = trn_hdr.organization_id 
      and INV_J.rtl_loc_id = trn_hdr.rtl_loc_id 
      and INV_J.business_date = trn_hdr.business_date 
      and INV_J.wkstn_id = trn_hdr.wkstn_id 
      and INV_J.trans_seq = trn_hdr.trans_seq ) as document

	,quantity as qty

	,(SELECT unitcount 
    from [inv_stock_ledger_acct] as sl_acc
       where sl_acc.organization_id = 1001 
       and sl_acc.rtl_loc_id = '${data.storeId}'  
       and sl_acc.ITEM_ID = inv_j.[inventory_item_id] 
			 and sl_acc.bucket_id in ('ON_HAND')) as on_hand

	 ,(select end_date_timestamp 
      from trl_rtrans_lineitm xstrli_s (nolock) 
      where xstrli_s.ORGANIZATION_ID = 1001 
      and xstrli_s.rtl_loc_id = INV_J.[rtl_loc_id]
      and xstrli_s.wkstn_id = INV_J.wkstn_id
      and xstrli_s.BUSINESS_DATE = inv_j.create_date
      and xstrli_s.trans_seq = INV_J.trans_seq) as time_trans

	 ,(SELECT unitcount 
      FROM [inv_stock_ledger_acct] as sl_acc
      where sl_acc.rtl_loc_id = '${data.storeId}' 
      and sl_acc.organization_id = 1001 
      and sl_acc.ITEM_ID = inv_j.[inventory_item_id] 
			and sl_acc.bucket_id in ('ORDER')) as on_order

    FROM [inv_inventory_journal] AS INV_J

    WHERE INV_J.organization_id = 1001  
	  and INV_J.[rtl_loc_id] = '${data.storeId}'
    and convert(char,inv_j.business_date,23) BETWEEN '${data.startDate}' AND '${data.endDate}'
    and inv_j.[inventory_item_id] like concat('%', rtrim('${data.productId}'), '%')
	 
    ORDER BY inv_j.create_date, inv_j.trans_seq
  `;
}
