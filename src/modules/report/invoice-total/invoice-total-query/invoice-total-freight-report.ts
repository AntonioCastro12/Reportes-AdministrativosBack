// import { InvoiceTotalDTO } from './../invoice-total.dto';

// export function invoiceTotalFreightReportQuery(data: InvoiceTotalDTO) {
//   return /*sql*/ `
//   USE xstore

//   SELECT

//   fact.Tipo saleTypeFreight
//   ,CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda, '00') ELSE FORMAT(fact.tienda, '000') END storeId
//   ,FORMAT(fact.fecha, 'yyyy-MM-dd') businessDate
//   ,sum(Isnull((((Fact.itemtaxamt_h + fact.valorunitario ) * Fact.cantidad ) - ( ( fact.discounttaxamt_j + fact.discounto ) * Fact.cantidad ) ), 0)) totalMoneyFreight

//             -- TOTAL
//             ,SUM (Fact.cantidad) totalUnitFreight
//           ,COUNT (Fact.cantidad) countInvoiceFreight

//   FROM   (
// select xom.trans_seq trn, xom.rtl_loc_id tienda, xom.wkstn_id caja,  xom.business_date fecha, 1 cantidad,
// (case when (select count(distinct xsm2.loc_id) total from xom_source_mod (nolock) xsm2 where xsm2.order_id = xo.order_id) = 1 THEN
// round((cast(xof.amount as DECIMAL(18, 6)))-(cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
// else
// (case when (sum(xol.extended_price)/xo.subtotal) >= 1 then
// round((cast(xof.amount as DECIMAL(18, 6)))-(cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
// else
// round(cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6))-(cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
// end)
// end) itemtaxamt_h,
// cast(0.00 as decimal(18,2)) discounttaxamt_j,
// (case when (select count(distinct xsm2.loc_id) total from xom_source_mod xsm2 where xsm2.order_id = xo.order_id) = 1 THEN
// round((cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
// else
// (case when (sum(xol.extended_price)/xo.subtotal) >= 1 then
// round((cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
// else
// round((cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
// end)
// end) valorunitario,
// cast(0.00 as decimal(18,2)) discounto,
// 'Fletes' Tipo
// from xom_order (nolock) xo
// join xom_order_line (nolock) xol on xo.order_id = xol.order_id
// join xom_source_mod xsm (nolock) on xol.order_id = xsm.order_id and xol.detail_seq = xsm.detail_seq
// join xom_order_mod xom (nolock) on xsm.order_id = xom.order_id and xsm.detail_seq = xom.detail_seq
// left join xom_order_fee xof (nolock) on xo.order_id = xof.order_id
// left join trl_sale_tax_lineitm txl (nolock) on xom.organization_id = txl.organization_id and xom.rtl_loc_id = txl.rtl_loc_id and xom.trans_seq = txl.trans_seq and xom.wkstn_id = txl.wkstn_id and xom.business_date = txl.business_date and xom.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
// where xo.status_code = 'COMPLETE'
// and xof.detail_seq = 1
// and xom.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
// and xom.rtl_loc_id = '${data.storeInfoId}'
// group by xom.rtl_loc_id,xom.wkstn_id, xom.trans_seq, xom.business_date, xof.detail_seq, xo.order_id, xo.subtotal, xof.amount, txl.tax_percentage
// ) AS Fact
// group by fact.tipo, fact.tienda, fact.fecha
// order by fact.tienda, fact.fecha, Fact.Tipo
//   `;
// }
