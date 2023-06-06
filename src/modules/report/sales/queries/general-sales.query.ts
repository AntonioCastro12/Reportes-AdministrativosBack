import { GeneralSalesDTO } from "../model/sales.dto";

export function generalSalesSaleQuery(data: GeneralSalesDTO) {
	return `
USE xstore

SELECT 
-- this are the names used by the frontend
MAIN.titleLine
, MAIN.countTransactions
, MAIN.totalMoney

FROM (

SELECT 

'Ventas Brutas' as titleLine
, Count(rpt.quantity) as countTransactions
, Sum(rpt.quantity * rpt.unit_price) as totalMoney


FROM   rpt_sale_line rpt
  
join trn_trans tt 
on tt.trans_seq = rpt.trans_seq
	and tt.wkstn_id = rpt.wkstn_id
	and tt.business_date = rpt.business_date

  WHERE  rpt.business_date = '${data.businessDate}'
  AND tt.trans_statcode = 'COMPLETE'
  -- AND rpt.return_flag = 0
  and rpt.item_id not in ('000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106','000000000000147718', '000000000000009044', '000000000000164518','000000000000164525','000000000000164526','000000000000164527')
  and rpt.sale_lineitm_typcode = 'SALE'
  and rpt.unit_price > 0
  and tt.post_void_flag = 0

  UNION ALL

  SELECT 
  'Ventas Netas' as titleLine
  ,Count(rpt.quantity) as countTransactions
  , Sum(rpt.net_amt) as totalMoney

  FROM   rpt_sale_line rpt
  
  join trn_trans tt 
  on tt.trans_seq = rpt.trans_seq
	and tt.wkstn_id = rpt.wkstn_id
	and tt.business_date = rpt.business_date

  WHERE  rpt.business_date = '${data.businessDate}'
  AND tt.trans_statcode = 'COMPLETE'
  -- AND rpt.return_flag = 0
  and rpt.item_id not in ('000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106','000000000000147718', '000000000000009044', '000000000000164518','000000000000164525','000000000000164526','000000000000164527')
  and rpt.sale_lineitm_typcode = 'SALE'
  and rpt.unit_price > 0
  and tt.post_void_flag = 0

  UNION ALL

  SELECT 
  'Devoluciones' as titleLine
  ,Count(rpt.quantity) as countTransactions
  , Sum(rpt.quantity * rpt.unit_price) as totalMoney
  

  FROM   rpt_sale_line rpt
  
  join trn_trans tt on tt.trans_seq = rpt.trans_seq
	and tt.wkstn_id = rpt.wkstn_id
	and tt.business_date = rpt.business_date

  WHERE  rpt.business_date = '${data.businessDate}'
  AND tt.trans_statcode = 'COMPLETE'
  AND rpt.return_flag = 1
  and rpt.item_id not in ('000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106','000000000000147718', '000000000000009044', '000000000000164518','000000000000164525','000000000000164526','000000000000164527')
  and rpt.sale_lineitm_typcode = 'SALE'
  and rpt.unit_price < 0
  and tt.post_void_flag = 0

  UNION ALL

  SELECT 
  'Descuentos' as titleLine
  ,Count(rpt.quantity) as countTransactions
  ,Sum(rpt.quantity * rpt.discount_amt) as totalMoney
 
   FROM   rpt_sale_line rpt
  
  join trn_trans tt on tt.trans_seq = rpt.trans_seq
	and tt.wkstn_id = rpt.wkstn_id
	and tt.business_date = rpt.business_date

  WHERE  rpt.business_date = '${data.businessDate}'
  AND tt.trans_statcode = 'COMPLETE'
  AND rpt.discount_amt > 0
  -- AND rpt.return_flag = 0
  and rpt.item_id not in ('000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106','000000000000147718', '000000000000009044', '000000000000164518','000000000000164525','000000000000164526','000000000000164527')
  and rpt.sale_lineitm_typcode = 'SALE'
  and tt.post_void_flag = 0

  UNION ALL

  SELECT 
  'Total Impuestos' as titleLine
  ,Count(rpt.quantity) as countTransactions
  ,Sum( rpt.unit_price - rpt.net_amt ) as totalMoney
 

  FROM   rpt_sale_line rpt
  
  join trn_trans tt on tt.trans_seq = rpt.trans_seq
	and tt.wkstn_id = rpt.wkstn_id
	and tt.business_date = rpt.business_date

  WHERE  rpt.business_date = '${data.businessDate}'
  AND tt.trans_statcode = 'COMPLETE'
  -- AND rpt.return_flag = 0
  and rpt.item_id not in ('000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106','000000000000147718', '000000000000009044', '000000000000164518','000000000000164525','000000000000164526','000000000000164527')
  and rpt.sale_lineitm_typcode = 'SALE'
  and rpt.unit_price > 0
  and tt.post_void_flag = 0

  UNION ALL

  SELECT 
  'Fletes' as titleLine
  ,COUNT(flete.trans_seq) as countTransactions
  ,SUM(Flete.valorunitario) as totalMoney
 
  
  from (
      SELECT xom.trans_seq,
      (case when (SELECT count(distinct xsm2.loc_id) total from xom_source_mod xsm2 where xsm2.order_id = xo.order_id) = 1 THEN cast(xof.amount as DECIMAL(18, 6)) else
      (case when (sum(xol.extended_price)/xo.subtotal) >= 1 then cast(xof.amount as DECIMAL(18, 6)) else  cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6)) end)
      end) valorunitario
      from xom_order xo
      join xom_order_line xol on xo.order_id = xol.order_id
      join xom_source_mod xsm on xol.order_id = xsm.order_id and xol.detail_seq = xsm.detail_seq
      join xom_order_mod xom on xsm.order_id = xom.order_id and xsm.detail_seq = xom.detail_seq
      left join xom_order_fee xof on xo.order_id = xof.order_id
      left join trl_sale_tax_lineitm txl  on xom.organization_id = txl.organization_id and xom.rtl_loc_id = txl.rtl_loc_id and xom.trans_seq = txl.trans_seq and xom.wkstn_id = txl.wkstn_id and xom.business_date = txl.business_date and xom.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
      where xo.status_code = 'COMPLETE'
      and xof.detail_seq = 1
      and xom.business_date = '${data.businessDate}'
      group by xom.trans_seq, xo.order_id, xo.subtotal, xof.amount) as Flete

      ) AS MAIN
 
`;
}

export function generalSalesPaymentMethodQuery(data: GeneralSalesDTO) {
	return `
    USE xstore

      SELECT 
      A.tndr_id as titleLine
      , Count(A.trans_seq) as countTransactions
      , Sum(A.total) as totalMoney

      FROM   (SELECT ttl.tndr_id, ttl.trans_seq, Sum(ttl.amt) total, ct.translation, trans_statcode statcode
        FROM   [dbo].ttr_tndr_lineitm ttl
               JOIN dbo.tnd_tndr tt ON tt.tndr_id = ttl.tndr_id
			   JOIN dbo.trn_trans rpt on rpt.business_date = ttl.business_date and rpt.trans_seq = ttl.trans_seq and rpt.wkstn_id = ttl.wkstn_id
		  	   join trl_rtrans_lineitm trl ON ttl.organization_id = trl.organization_id AND ttl.rtl_loc_id = trl.rtl_loc_id AND ttl.trans_seq = trl.trans_seq AND ttl.wkstn_id = trl.wkstn_id AND ttl.business_date = trl.business_date AND ttl.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
               JOIN dbo.com_translations ct ON ct.translation_key = tt.description
        WHERE  ttl.business_date = '${data.businessDate}'
          AND rpt.trans_statcode = 'COMPLETE'
          AND trl.void_flag = 0
          and rpt.post_void_flag = 0
GROUP  BY ttl.tndr_id, ttl.trans_seq, ct.translation, trans_statcode, ttl.business_date, ttl.wkstn_id) AS A
GROUP  BY A.tndr_id, A.translation
`;
}
