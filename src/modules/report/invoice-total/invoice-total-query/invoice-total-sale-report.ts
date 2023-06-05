// import { InvoiceTotalDTO } from '../invoice-total.dto';

// export function invoiceTotalSaleReportQuery(data: InvoiceTotalDTO) {
//   return /*sql*/ `
// 	USE xstore

//   SELECT  fact.Tipo saleTypeSale
//        ,CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda,'00') ELSE FORMAT(fact.tienda,'000') END storeId
//        ,FORMAT(fact.fecha,'yyyy-MM-dd') businessDate

//        -- TOTAL $
//        ,SUM( Isnull( ( ( (Fact.itemtaxamt_h + fact.valorunitario) * Fact.cantidad ) + ( ( (fact.discounttaxamt_j + fact.discounto) * Fact.cantidad ) ) * -1 ),0 ) ) totalMoneySale
//        -- TOTAL
//          ,SUM (Fact.cantidad) totalUnitSale
//          ,COUNT (Fact.cantidad) countInvoiceSale
// FROM
// (
// 	SELECT  tsl.trans_seq      AS transseq
// 	       ,trn.rtl_loc_id     AS tienda
// 	       ,trn.wkstn_id       AS caja
// 	       ,trn.business_date  AS fecha
// 	       ,Sum (tsl.quantity) AS cantidad
// 	       ,CASE txl.tax_percentage WHEN 0 THEN Round ((rsl.gross_amt / rsl.actual_quantity),2) ELSE ( (rsl.gross_amt / rsl.actual_quantity) - ( Round( ( (rsl.gross_amt / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage,0)) ),2 ) ) ) END AS itemtaxamt_h
// 	       ,CASE txl.tax_percentage WHEN 0 THEN rsl.gross_amt ELSE (
// 	SELECT  COALESCE( (SUM(dmod.extended_amt) / rsl.actual_quantity) - ( Round( (SUM(dmod.extended_amt) / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage,0)),2 ) ),0 )
// 	FROM [dbo].trl_rtl_price_mod dmod
// 	WHERE dmod.organization_id = trl.organization_id
// 	AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
// 	AND dmod.rtl_loc_id = trl.rtl_loc_id
// 	AND dmod.wkstn_id = trl.wkstn_id
// 	AND dmod.business_date = trl.business_date
// 	AND dmod.trans_seq = trl.trans_seq
// 	AND dmod.void_flag = 0
// 	AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT') ) END AS discounttaxamt_j, CASE txl.tax_percentage WHEN 0 THEN (rsl.gross_amt / rsl.actual_quantity) ELSE Round( ( (rsl.gross_amt / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage, 0)) ), 2 ) END AS valorunitario, CASE txl.tax_percentage WHEN 0 THEN rsl.gross_amt ELSE (
// 	SELECT  COALESCE ( ( Round( (SUM(dmod.extended_amt) / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage,0)),2 ) ),0 )
// 	FROM [dbo].trl_rtl_price_mod dmod
// 	WHERE dmod.organization_id = trl.organization_id
// 	AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
// 	AND dmod.rtl_loc_id = trl.rtl_loc_id
// 	AND dmod.wkstn_id = trl.wkstn_id
// 	AND dmod.business_date = trl.business_date
// 	AND dmod.trans_seq = trl.trans_seq
// 	AND dmod.void_flag = 0
// 	AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT') ) END AS discounto, 'Ventas' AS Tipo
// 	FROM [dbo].trn_trans trn
// 	LEFT JOIN [dbo].trl_rtrans_lineitm trl
// 	ON trn.organization_id = trl.organization_id AND trn.rtl_loc_id = trl.rtl_loc_id AND trn.trans_seq = trl.trans_seq AND trn.wkstn_id = trl.wkstn_id AND trn.business_date = trl.business_date
// 	LEFT JOIN [dbo].trl_sale_lineitm tsl
// 	ON tsl.organization_id = trl.organization_id AND tsl.rtl_loc_id = trl.rtl_loc_id AND tsl.trans_seq = trl.trans_seq AND tsl.wkstn_id = trl.wkstn_id AND tsl.business_date = trl.business_date AND tsl.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
// 	LEFT JOIN [dbo].trl_sale_tax_lineitm txl
// 	ON tsl.organization_id = txl.organization_id AND tsl.rtl_loc_id = txl.rtl_loc_id AND tsl.trans_seq = txl.trans_seq AND tsl.wkstn_id = txl.wkstn_id AND tsl.business_date = txl.business_date AND tsl.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
// 	LEFT JOIN [dbo].rpt_sale_line rsl
// 	ON tsl.organization_id = trl.organization_id AND tsl.rtl_loc_id = rsl.rtl_loc_id AND tsl.business_date = rsl.business_date AND tsl.wkstn_id = rsl.wkstn_id AND tsl.trans_seq = rsl.trans_seq AND tsl.rtrans_lineitm_seq = rsl.rtrans_lineitm_seq
// 	LEFT JOIN [dbo].xom_order_mod xom
// 	ON tsl.rtl_loc_id = xom.rtl_loc_id AND tsl.business_date = xom.business_date AND tsl.wkstn_id = xom.wkstn_id AND tsl.trans_seq = xom.trans_seq AND tsl.rtrans_lineitm_Seq = xom.rtrans_lineitm_Seq
// 	LEFT JOIN [dbo].xom_order xo
// 	ON xom.order_id = xo.order_id
// 	WHERE (
// 	SELECT  COUNT(*)
// 	FROM [dbo].trn_trans_p
// 	WHERE trn_trans_p.property_code IN ( 'GLOBAL_SALE_FACTURA_NUMBER,GLOBAL_RETURN_FACTURA_NUMBER' )
// 	AND tsl.organization_id = trn_trans_p.organization_id
// 	AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id
// 	AND tsl.trans_seq = trn_trans_p.trans_seq
// 	AND tsl.wkstn_id = trn_trans_p.wkstn_id
// 	AND tsl.business_date = trn_trans_p.business_date ) = 0 AND trn.organization_id IN (1001, 1003) AND trn.trans_statcode = 'COMPLETE' AND trn.trans_typcode = 'RETAIL_SALE' AND trn.post_void_flag = '0' AND trn.business_date BETWEEN '${data.startDate}' AND '${data.endDate}' AND trl.rtrans_lineitm_typcode = 'ITEM' AND trl.void_flag = '0' AND tsl.exclude_from_net_sales_flag = '0' AND tsl.sale_lineitm_typcode IN ('SALE', 'ORDER') AND tsl.item_id NOT IN ( '000000000000009037', '000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106', '000000000000147718' ) AND tsl.item_id NOT IN ( SELECT item_id FROM [dbo].itm_item_p itmp WHERE property_code = 'FACTURA_REQUIRED'
// 	AND tsl.organization_id = itmp.organization_id
// 	AND itmp.string_value != 'Y' ) AND ( trn.total > 0 or trn.trans_seq IN ( SELECT trans_seq FROM [dbo].trn_trans_p WHERE property_code = 'ORDER_TRANSACTION_COMPLETED' AND tsl.organization_id = trn_trans_p.organization_id AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id AND tsl.trans_seq = trn_trans_p.trans_seq AND tsl.wkstn_id = trn_trans_p.wkstn_id AND tsl.business_date = trn_trans_p.business_date ) )
// 	-- AND ISNULL(xo.status_code, 'COMPLETE') IN ('COMPLETE', 'OPEN')
// 	GROUP BY  tsl.trans_seq
// 	         ,trn.rtl_loc_id
// 	         ,trn.wkstn_id
// 	         ,trn.business_date
// 	         ,tsl.item_id
// 	         ,tsl.unit_price
// 	         ,rsl.gross_amt
// 	         ,rsl.quantity
// 	         ,txl.tax_percentage
// 	         ,rsl.actual_quantity
// 	         ,trl.organization_id
// 	         ,trl.rtrans_lineitm_seq
// 	         ,trl.rtl_loc_id
// 	         ,trl.wkstn_id
// 	         ,trl.business_date
// 	         ,trl.trans_seq
// ) AS Fact
// GROUP BY  fact.tipo
//          ,fact.tienda
//          ,fact.fecha
// ORDER BY fact.tienda
//          ,fact.fecha
//          ,Fact.Tipo desc
//   `;
// }
