import { InvoiceTotalDTO } from "../model/sales.dto";

export function SalesQuery(data: InvoiceTotalDTO) {
	return `
		USE xstore
	  SELECT  fact.Tipo saleTypeSale
	       ,CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda,'00') ELSE FORMAT(fact.tienda,'000') END storeId
	       ,FORMAT(fact.fecha,'yyyy-MM-dd') businessDate
	       -- TOTAL $
	       ,SUM( Isnull( ( ( (Fact.itemtaxamt_h + fact.valorunitario) * Fact.cantidad ) + ( ( (fact.discounttaxamt_j + fact.discounto) * Fact.cantidad ) ) * -1 ),0 ) ) totalMoneySale
	       -- TOTAL
	         ,SUM (Fact.cantidad) totalUnitSale
	         ,COUNT (Fact.cantidad) countInvoiceSale
	FROM
	(
		SELECT  tsl.trans_seq      AS transseq
		       ,trn.rtl_loc_id     AS tienda
		       ,trn.wkstn_id       AS caja
		       ,trn.business_date  AS fecha
		       ,Sum (tsl.quantity) AS cantidad
		       ,CASE txl.tax_percentage WHEN 0 THEN Round ((rsl.gross_amt / rsl.actual_quantity),2) ELSE ( (rsl.gross_amt / rsl.actual_quantity) - ( Round( ( (rsl.gross_amt / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage,0)) ),2 ) ) ) END AS itemtaxamt_h
		       ,CASE txl.tax_percentage WHEN 0 THEN rsl.gross_amt ELSE (
		SELECT  COALESCE( (SUM(dmod.extended_amt) / rsl.actual_quantity) - ( Round( (SUM(dmod.extended_amt) / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage,0)),2 ) ),0 )
		FROM [dbo].trl_rtl_price_mod dmod
		WHERE dmod.organization_id = trl.organization_id
		AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
		AND dmod.rtl_loc_id = trl.rtl_loc_id
		AND dmod.wkstn_id = trl.wkstn_id
		AND dmod.business_date = trl.business_date
		AND dmod.trans_seq = trl.trans_seq
		AND dmod.void_flag = 0
		AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT') ) END AS discounttaxamt_j, CASE txl.tax_percentage WHEN 0 THEN (rsl.gross_amt / rsl.actual_quantity) ELSE Round( ( (rsl.gross_amt / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage, 0)) ), 2 ) END AS valorunitario, CASE txl.tax_percentage WHEN 0 THEN rsl.gross_amt ELSE (
		SELECT  COALESCE ( ( Round( (SUM(dmod.extended_amt) / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage,0)),2 ) ),0 )
		FROM [dbo].trl_rtl_price_mod dmod
		WHERE dmod.organization_id = trl.organization_id
		AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
		AND dmod.rtl_loc_id = trl.rtl_loc_id
		AND dmod.wkstn_id = trl.wkstn_id
		AND dmod.business_date = trl.business_date
		AND dmod.trans_seq = trl.trans_seq
		AND dmod.void_flag = 0
		AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT') ) END AS discounto, 'Ventas' AS Tipo
		FROM [dbo].trn_trans trn
		LEFT JOIN [dbo].trl_rtrans_lineitm trl
		ON trn.organization_id = trl.organization_id AND trn.rtl_loc_id = trl.rtl_loc_id AND trn.trans_seq = trl.trans_seq AND trn.wkstn_id = trl.wkstn_id AND trn.business_date = trl.business_date
		LEFT JOIN [dbo].trl_sale_lineitm tsl
		ON tsl.organization_id = trl.organization_id AND tsl.rtl_loc_id = trl.rtl_loc_id AND tsl.trans_seq = trl.trans_seq AND tsl.wkstn_id = trl.wkstn_id AND tsl.business_date = trl.business_date AND tsl.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
		LEFT JOIN [dbo].trl_sale_tax_lineitm txl
		ON tsl.organization_id = txl.organization_id AND tsl.rtl_loc_id = txl.rtl_loc_id AND tsl.trans_seq = txl.trans_seq AND tsl.wkstn_id = txl.wkstn_id AND tsl.business_date = txl.business_date AND tsl.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
		LEFT JOIN [dbo].rpt_sale_line rsl
		ON tsl.organization_id = trl.organization_id AND tsl.rtl_loc_id = rsl.rtl_loc_id AND tsl.business_date = rsl.business_date AND tsl.wkstn_id = rsl.wkstn_id AND tsl.trans_seq = rsl.trans_seq AND tsl.rtrans_lineitm_seq = rsl.rtrans_lineitm_seq
		LEFT JOIN [dbo].xom_order_mod xom
		ON tsl.rtl_loc_id = xom.rtl_loc_id AND tsl.business_date = xom.business_date AND tsl.wkstn_id = xom.wkstn_id AND tsl.trans_seq = xom.trans_seq AND tsl.rtrans_lineitm_Seq = xom.rtrans_lineitm_Seq
		LEFT JOIN [dbo].xom_order xo
		ON xom.order_id = xo.order_id
		WHERE (
		SELECT  COUNT(*)
		FROM [dbo].trn_trans_p
		WHERE trn_trans_p.property_code IN ( 'GLOBAL_SALE_FACTURA_NUMBER,GLOBAL_RETURN_FACTURA_NUMBER' )
		AND tsl.organization_id = trn_trans_p.organization_id
		AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id
		AND tsl.trans_seq = trn_trans_p.trans_seq
		AND tsl.wkstn_id = trn_trans_p.wkstn_id
		AND tsl.business_date = trn_trans_p.business_date ) = 0 AND trn.organization_id IN (1001, 1003) AND trn.trans_statcode = 'COMPLETE' AND trn.trans_typcode = 'RETAIL_SALE' AND trn.post_void_flag = '0' AND trn.business_date BETWEEN '${data.startDate}' AND '${data.endDate}' AND trl.rtrans_lineitm_typcode = 'ITEM' AND trl.void_flag = '0' AND tsl.exclude_from_net_sales_flag = '0' AND tsl.sale_lineitm_typcode IN ('SALE', 'ORDER') AND tsl.item_id NOT IN ( '000000000000009037', '000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106', '000000000000147718' ) AND tsl.item_id NOT IN ( SELECT item_id FROM [dbo].itm_item_p itmp WHERE property_code = 'FACTURA_REQUIRED'
		AND tsl.organization_id = itmp.organization_id
		AND itmp.string_value != 'Y' ) AND ( trn.total > 0 or trn.trans_seq IN ( SELECT trans_seq FROM [dbo].trn_trans_p WHERE property_code = 'ORDER_TRANSACTION_COMPLETED' AND tsl.organization_id = trn_trans_p.organization_id AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id AND tsl.trans_seq = trn_trans_p.trans_seq AND tsl.wkstn_id = trn_trans_p.wkstn_id AND tsl.business_date = trn_trans_p.business_date ) )
		-- AND ISNULL(xo.status_code, 'COMPLETE') IN ('COMPLETE', 'OPEN')
		GROUP BY  tsl.trans_seq
		         ,trn.rtl_loc_id
		         ,trn.wkstn_id
		         ,trn.business_date
		         ,tsl.item_id
		         ,tsl.unit_price
		         ,rsl.gross_amt
		         ,rsl.quantity
		         ,txl.tax_percentage
		         ,rsl.actual_quantity
		         ,trl.organization_id
		         ,trl.rtrans_lineitm_seq
		         ,trl.rtl_loc_id
		         ,trl.wkstn_id
		         ,trl.business_date
		         ,trl.trans_seq
	) AS Fact
	GROUP BY  fact.tipo
	         ,fact.tienda
	         ,fact.fecha
	ORDER BY fact.tienda
	         ,fact.fecha
	         ,Fact.Tipo desc
	  `;
}

export function ReturnQuery(data: InvoiceTotalDTO) {
	return `
  USE xstore

  SELECT
       fact.Tipo saleTypeReturn
      ,CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda, '00') ELSE FORMAT(fact.tienda, '000') END storeId
       ,FORMAT(fact.fecha, 'yyyy-MM-dd') businessDate
       ,sum(Isnull((((Fact.itemtaxamt_h + fact.valorunitario) * Fact.cantidad) + (((fact.discounttaxamt_j + fact.discounto) * Fact.cantidad))*-1), 0)) totalMoneyReturn

          -- TOTAL
          ,SUM (Fact.cantidad) totalUnitReturn
          ,COUNT (Fact.cantidad) countInvoiceReturn

  FROM   (
    SELECT tsl.trans_seq      AS transseq,
        trn.rtl_loc_id     AS tienda,
        trn.wkstn_id       AS caja,
        trn.business_date  AS fecha,
        Sum (tsl.quantity) AS cantidad,
        CASE txl.tax_percentage
        WHEN 0 THEN Round((rsl.gross_amt/rsl.actual_quantity),2)
        ELSE ((rsl.gross_amt/rsl.actual_quantity) - (Round(((rsl.gross_amt/rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0))),2)))
        END                AS itemtaxamt_h,
        CASE txl.tax_percentage
        WHEN 0 THEN rsl.gross_amt
        ELSE (SELECT COALESCE((Sum(dmod.extended_amt)/rsl.actual_quantity) - (Round((Sum(dmod.extended_amt)/rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0)),2)),0)
            FROM   [dbo].trl_rtl_price_mod dmod
            WHERE  dmod.organization_id = trl.organization_id
                AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
                AND dmod.rtl_loc_id = trl.rtl_loc_id
                AND dmod.wkstn_id = trl.wkstn_id
                AND dmod.business_date = trl.business_date
                AND dmod.trans_seq = trl.trans_seq
                AND dmod.void_flag = 0
                AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT'))
        END                AS discounttaxamt_j,
        CASE txl.tax_percentage
        WHEN 0 THEN (rsl.gross_amt/rsl.actual_quantity)
        ELSE Round(((rsl.gross_amt/rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0))),2)
        END                AS valorunitario,
        CASE txl.tax_percentage
        WHEN 0 THEN rsl.gross_amt
        ELSE (SELECT COALESCE((Round((Sum(dmod.extended_amt)/rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0)),2)),0)
            FROM [dbo].trl_rtl_price_mod dmod
            WHERE dmod.organization_id = trl.organization_id
            AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
            AND dmod.rtl_loc_id = trl.rtl_loc_id
            AND dmod.wkstn_id = trl.wkstn_id
            AND dmod.business_date = trl.business_date
            AND dmod.trans_seq = trl.trans_seq
            AND dmod.void_flag = 0
            AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT'))
        END                AS discounto,
        'Devoluciones' as Tipo
    FROM   [dbo].trn_trans trn
        LEFT JOIN [dbo].trl_rtrans_lineitm trl ON trn.organization_id = trl.organization_id AND trn.rtl_loc_id = trl.rtl_loc_id AND trn.trans_seq = trl.trans_seq AND trn.wkstn_id = trl.wkstn_id AND trn.business_date = trl.business_date
        LEFT JOIN [dbo].trl_sale_lineitm tsl ON tsl.organization_id = trl.organization_id AND tsl.rtl_loc_id = trl.rtl_loc_id AND tsl.trans_seq = trl.trans_seq AND tsl.wkstn_id = trl.wkstn_id AND tsl.business_date = trl.business_date AND tsl.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
        LEFT JOIN [dbo].trl_sale_tax_lineitm txl ON tsl.organization_id = txl.organization_id AND tsl.rtl_loc_id = txl.rtl_loc_id AND tsl.trans_seq = txl.trans_seq AND tsl.wkstn_id = txl.wkstn_id AND tsl.business_date = txl.business_date AND tsl.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
        LEFT JOIN [dbo].rpt_sale_line rsl ON tsl.organization_id = trl.organization_id AND tsl.rtl_loc_id = rsl.rtl_loc_id AND tsl.business_date = rsl.business_date AND tsl.wkstn_id = rsl.wkstn_id AND tsl.trans_seq = rsl.trans_seq AND tsl.rtrans_lineitm_seq = rsl.rtrans_lineitm_seq
    WHERE  (SELECT Count(*) FROM [dbo].trn_trans_p WHERE trn_trans_p.property_code IN ('GLOBAL_SALE_FACTURA_NUMBER,GLOBAL_RETURN_FACTURA_NUMBER') AND tsl.organization_id = trn_trans_p.organization_id AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id AND tsl.trans_seq = trn_trans_p.trans_seq AND tsl.wkstn_id = trn_trans_p.wkstn_id AND tsl.business_date = trn_trans_p.business_date) = 0
        AND trn.organization_id IN (1001, 1003)
        AND trn.trans_statcode = 'COMPLETE'
        AND trn.trans_typcode = 'RETAIL_SALE'
        AND trn.post_void_flag = '0'
        AND trn.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
        AND trl.rtrans_lineitm_typcode = 'ITEM'
        AND trl.void_flag = '0'
        AND tsl.exclude_from_net_sales_flag = '0'
        AND tsl.sale_lineitm_typcode IN ('SALE','ORDER')
          AND tsl.item_id NOT IN  ('000000000000009037','000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106','000000000000147718')
        AND tsl.item_id NOT IN (SELECT item_id FROM [dbo].itm_item_p itmp WHERE  property_code = 'FACTURA_REQUIRED' AND tsl.organization_id = itmp.organization_id AND itmp.string_value != 'Y')
        AND (trn.total < 0  AND trn.trans_seq NOT IN (SELECT trans_seq  FROM [dbo].trn_trans_p  WHERE property_code = 'ORDER_TRANSACTION_COMPLETED' AND tsl.organization_id = trn_trans_p.organization_id AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id AND tsl.trans_seq = trn_trans_p.trans_seq AND tsl.wkstn_id = trn_trans_p.wkstn_id AND tsl.business_date = trn_trans_p.business_date))
    GROUP  BY tsl.trans_seq, trn.rtl_loc_id, trn.wkstn_id, trn.business_date, tsl.item_id, tsl.unit_price, rsl.gross_amt, rsl.quantity, txl.tax_percentage, rsl.actual_quantity, trl.organization_id, trl.rtrans_lineitm_seq, trl.rtl_loc_id, trl.wkstn_id, trl.business_date, trl.trans_seq
  ) AS Fact
  group by fact.Tipo, fact.tienda, fact.fecha
  order by fact.tienda, fact.fecha
  `;
}

export function FreightQuery(data: InvoiceTotalDTO) {
	return `
  USE xstore

  SELECT

  fact.Tipo saleTypeFreight
  ,CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda, '00') ELSE FORMAT(fact.tienda, '000') END storeId
  ,FORMAT(fact.fecha, 'yyyy-MM-dd') businessDate
  ,sum(Isnull((((Fact.itemtaxamt_h + fact.valorunitario ) * Fact.cantidad ) - ( ( fact.discounttaxamt_j + fact.discounto ) * Fact.cantidad ) ), 0)) totalMoneyFreight

            -- TOTAL
            ,SUM (Fact.cantidad) totalUnitFreight
          ,COUNT (Fact.cantidad) countInvoiceFreight

  FROM   (
select xom.trans_seq trn, xom.rtl_loc_id tienda, xom.wkstn_id caja,  xom.business_date fecha, 1 cantidad,
(case when (select count(distinct xsm2.loc_id) total from xom_source_mod (nolock) xsm2 where xsm2.order_id = xo.order_id) = 1 THEN
round((cast(xof.amount as DECIMAL(18, 6)))-(cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
else
(case when (sum(xol.extended_price)/xo.subtotal) >= 1 then
round((cast(xof.amount as DECIMAL(18, 6)))-(cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
else
round(cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6))-(cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
end)
end) itemtaxamt_h,
cast(0.00 as decimal(18,2)) discounttaxamt_j,
(case when (select count(distinct xsm2.loc_id) total from xom_source_mod xsm2 where xsm2.order_id = xo.order_id) = 1 THEN
round((cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
else
(case when (sum(xol.extended_price)/xo.subtotal) >= 1 then
round((cast(xof.amount as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
else
round((cast((xof.amount*(sum(xol.extended_price)/xo.subtotal)) as DECIMAL(18, 6))/cast(1+txl.tax_percentage as decimal(18,6))),2)
end)
end) valorunitario,
cast(0.00 as decimal(18,2)) discounto,
'Fletes' Tipo
from xom_order (nolock) xo
join xom_order_line (nolock) xol on xo.order_id = xol.order_id
join xom_source_mod xsm (nolock) on xol.order_id = xsm.order_id and xol.detail_seq = xsm.detail_seq
join xom_order_mod xom (nolock) on xsm.order_id = xom.order_id and xsm.detail_seq = xom.detail_seq
left join xom_order_fee xof (nolock) on xo.order_id = xof.order_id
left join trl_sale_tax_lineitm txl (nolock) on xom.organization_id = txl.organization_id and xom.rtl_loc_id = txl.rtl_loc_id and xom.trans_seq = txl.trans_seq and xom.wkstn_id = txl.wkstn_id and xom.business_date = txl.business_date and xom.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
where xo.status_code = 'COMPLETE'
and xof.detail_seq = 1
and xom.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
and xom.rtl_loc_id = '${data.storeId}'
group by xom.rtl_loc_id,xom.wkstn_id, xom.trans_seq, xom.business_date, xof.detail_seq, xo.order_id, xo.subtotal, xof.amount, txl.tax_percentage
) AS Fact
group by fact.tipo, fact.tienda, fact.fecha
order by fact.tienda, fact.fecha, Fact.Tipo
  `;
}

export function invoiceTotalQuery(data: InvoiceTotalDTO) {
	return `
	

SELECT

	CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda, '00') ELSE FORMAT(fact.tienda, '000') END storeId,
	FORMAT(fact.fecha, 'yyyy-MM-dd') businessDate,
	fact.Tipo saleTypeSale,
	SUM( Isnull( ( ( (Fact.itemtaxamt_h + fact.valorunitario) * Fact.cantidad ) + ( ( (fact.discounttaxamt_j + fact.discounto) * Fact.cantidad ) ) * -1 ), 0 ) ) totalMoneySale,
	SUM (Fact.cantidad) totalUnitSale,
	COUNT (Fact.cantidad) countInvoiceSale,
	NULL saleTypeReturn,
	NULL totalMoneyReturn,
	NULL totalUnitReturn,
	NULL countInvoiceReturn,
	NULL saleTypeFreight,
	NULL totalMoneyFreight,
	NULL totalUnitFreight,
	NULL countInvoiceFreight
FROM
	(
	SELECT
		tsl.trans_seq AS transseq
		       ,
		trn.rtl_loc_id AS tienda
		       ,
		trn.wkstn_id AS caja
		       ,
		trn.business_date AS fecha
		       ,
		Sum (tsl.quantity) AS cantidad
		       ,
		CASE
			txl.tax_percentage WHEN 0 THEN Round ((rsl.gross_amt / rsl.actual_quantity),
			2)
			ELSE ( (rsl.gross_amt / rsl.actual_quantity) - ( Round( ( (rsl.gross_amt / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage, 0)) ), 2 ) ) )
		END AS itemtaxamt_h
		       ,
		CASE
			txl.tax_percentage WHEN 0 THEN rsl.gross_amt
			ELSE (
			SELECT
				COALESCE( (SUM(dmod.extended_amt) / rsl.actual_quantity) - ( Round( (SUM(dmod.extended_amt) / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage, 0)), 2 ) ),
				0 )
			FROM
				[dbo].trl_rtl_price_mod dmod
			WHERE
				dmod.organization_id = trl.organization_id
				AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
				AND dmod.rtl_loc_id = trl.rtl_loc_id
				AND dmod.wkstn_id = trl.wkstn_id
				AND dmod.business_date = trl.business_date
				AND dmod.trans_seq = trl.trans_seq
				AND dmod.void_flag = 0
				AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT') )
		END AS discounttaxamt_j,
		CASE
			txl.tax_percentage WHEN 0 THEN (rsl.gross_amt / rsl.actual_quantity)
			ELSE Round( ( (rsl.gross_amt / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage, 0)) ), 2 )
		END AS valorunitario,
		CASE
			txl.tax_percentage WHEN 0 THEN rsl.gross_amt
			ELSE (
			SELECT
				COALESCE ( ( Round( (SUM(dmod.extended_amt) / rsl.actual_quantity) /(1 + COALESCE(txl.tax_percentage, 0)), 2 ) ),
				0 )
			FROM
				[dbo].trl_rtl_price_mod dmod
			WHERE
				dmod.organization_id = trl.organization_id
				AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
				AND dmod.rtl_loc_id = trl.rtl_loc_id
				AND dmod.wkstn_id = trl.wkstn_id
				AND dmod.business_date = trl.business_date
				AND dmod.trans_seq = trl.trans_seq
				AND dmod.void_flag = 0
				AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT') )
		END AS discounto,
		'Ventas' AS Tipo
	FROM
		[dbo].trn_trans trn
	LEFT JOIN [dbo].trl_rtrans_lineitm trl
		ON
		trn.organization_id = trl.organization_id
		AND trn.rtl_loc_id = trl.rtl_loc_id
		AND trn.trans_seq = trl.trans_seq
		AND trn.wkstn_id = trl.wkstn_id
		AND trn.business_date = trl.business_date
	LEFT JOIN [dbo].trl_sale_lineitm tsl
		ON
		tsl.organization_id = trl.organization_id
		AND tsl.rtl_loc_id = trl.rtl_loc_id
		AND tsl.trans_seq = trl.trans_seq
		AND tsl.wkstn_id = trl.wkstn_id
		AND tsl.business_date = trl.business_date
		AND tsl.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
	LEFT JOIN [dbo].trl_sale_tax_lineitm txl
		ON
		tsl.organization_id = txl.organization_id
		AND tsl.rtl_loc_id = txl.rtl_loc_id
		AND tsl.trans_seq = txl.trans_seq
		AND tsl.wkstn_id = txl.wkstn_id
		AND tsl.business_date = txl.business_date
		AND tsl.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
	LEFT JOIN [dbo].rpt_sale_line rsl
		ON
		tsl.organization_id = trl.organization_id
		AND tsl.rtl_loc_id = rsl.rtl_loc_id
		AND tsl.business_date = rsl.business_date
		AND tsl.wkstn_id = rsl.wkstn_id
		AND tsl.trans_seq = rsl.trans_seq
		AND tsl.rtrans_lineitm_seq = rsl.rtrans_lineitm_seq
	LEFT JOIN [dbo].xom_order_mod xom
		ON
		tsl.rtl_loc_id = xom.rtl_loc_id
		AND tsl.business_date = xom.business_date
		AND tsl.wkstn_id = xom.wkstn_id
		AND tsl.trans_seq = xom.trans_seq
		AND tsl.rtrans_lineitm_Seq = xom.rtrans_lineitm_Seq
	LEFT JOIN [dbo].xom_order xo
		ON
		xom.order_id = xo.order_id
	WHERE
		(
		SELECT
			COUNT(*)
		FROM
			[dbo].trn_trans_p
		WHERE
			trn_trans_p.property_code IN ('GLOBAL_SALE_FACTURA_NUMBER,GLOBAL_RETURN_FACTURA_NUMBER')
				AND tsl.organization_id = trn_trans_p.organization_id
				AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id
				AND tsl.trans_seq = trn_trans_p.trans_seq
				AND tsl.wkstn_id = trn_trans_p.wkstn_id
				AND tsl.business_date = trn_trans_p.business_date ) = 0
		AND trn.organization_id IN (1001, 1003)
		AND trn.trans_statcode = 'COMPLETE'
		AND trn.trans_typcode = 'RETAIL_SALE'
		AND trn.post_void_flag = '0'
		AND trn.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
		AND trl.rtrans_lineitm_typcode = 'ITEM'
		AND trl.void_flag = '0'
		AND tsl.exclude_from_net_sales_flag = '0'
		AND tsl.sale_lineitm_typcode IN ('SALE', 'ORDER')
		AND tsl.item_id NOT IN ( '000000000000009037', '000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106', '000000000000147718' )
		AND tsl.item_id NOT IN (
		SELECT
			item_id
		FROM
			[dbo].itm_item_p itmp
		WHERE
			property_code = 'FACTURA_REQUIRED'
			AND tsl.organization_id = itmp.organization_id
			AND itmp.string_value != 'Y' )
		AND ( trn.total > 0
			or trn.trans_seq IN (
			SELECT
				trans_seq
			FROM
				[dbo].trn_trans_p
			WHERE
				property_code = 'ORDER_TRANSACTION_COMPLETED'
				AND tsl.organization_id = trn_trans_p.organization_id
				AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id
				AND tsl.trans_seq = trn_trans_p.trans_seq
				AND tsl.wkstn_id = trn_trans_p.wkstn_id
				AND tsl.business_date = trn_trans_p.business_date ) )
		-- AND ISNULL(xo.status_code, 'COMPLETE') IN ('COMPLETE', 'OPEN')
	GROUP BY
		tsl.trans_seq
		         ,
		trn.rtl_loc_id
		         ,
		trn.wkstn_id
		         ,
		trn.business_date
		         ,
		tsl.item_id
		         ,
		tsl.unit_price
		         ,
		rsl.gross_amt
		         ,
		rsl.quantity
		         ,
		txl.tax_percentage
		         ,
		rsl.actual_quantity
		         ,
		trl.organization_id
		         ,
		trl.rtrans_lineitm_seq
		         ,
		trl.rtl_loc_id
		         ,
		trl.wkstn_id
		         ,
		trl.business_date
		         ,
		trl.trans_seq
	) AS Fact
GROUP BY
	fact.tipo
	         ,
	fact.tienda
	         ,
	fact.fecha



UNION ALL


SELECT
	
	CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda, '00') ELSE FORMAT(fact.tienda, '000') END storeId,
	FORMAT(fact.fecha, 'yyyy-MM-dd') businessDate,
	NULL saleTypeSale,
	NULL totalMoneySale,
	NULL  totalUnitSale,
	NULL countInvoiceSale,
    fact.Tipo saleTypeReturn,
	sum(Isnull((((Fact.itemtaxamt_h + fact.valorunitario) * Fact.cantidad) + (((fact.discounttaxamt_j + fact.discounto) * Fact.cantidad))*-1), 0)) totalMoneyReturn,
	SUM (Fact.cantidad) totalUnitReturn,
	COUNT (Fact.cantidad) countInvoiceReturn,
		NULL saleTypeFreight,
	NULL totalMoneyFreight,
	NULL totalUnitFreight,
	NULL countInvoiceFreight
FROM
	(
	SELECT
		tsl.trans_seq AS transseq,
		trn.rtl_loc_id AS tienda,
		trn.wkstn_id AS caja,
		trn.business_date AS fecha,
		Sum (tsl.quantity) AS cantidad,
		CASE
			txl.tax_percentage
        WHEN 0 THEN Round((rsl.gross_amt / rsl.actual_quantity), 2)
			ELSE ((rsl.gross_amt / rsl.actual_quantity) - (Round(((rsl.gross_amt / rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0))), 2)))
		END AS itemtaxamt_h,
		CASE
			txl.tax_percentage
        WHEN 0 THEN rsl.gross_amt
			ELSE (
			SELECT
				COALESCE((Sum(dmod.extended_amt)/ rsl.actual_quantity) - (Round((Sum(dmod.extended_amt)/ rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0)), 2)),
				0)
			FROM
				[dbo].trl_rtl_price_mod dmod
			WHERE
				dmod.organization_id = trl.organization_id
				AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
				AND dmod.rtl_loc_id = trl.rtl_loc_id
				AND dmod.wkstn_id = trl.wkstn_id
				AND dmod.business_date = trl.business_date
				AND dmod.trans_seq = trl.trans_seq
				AND dmod.void_flag = 0
				AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT'))
		END AS discounttaxamt_j,
		CASE
			txl.tax_percentage
        WHEN 0 THEN (rsl.gross_amt / rsl.actual_quantity)
			ELSE Round(((rsl.gross_amt / rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0))), 2)
		END AS valorunitario,
		CASE
			txl.tax_percentage
        WHEN 0 THEN rsl.gross_amt
			ELSE (
			SELECT
				COALESCE((Round((Sum(dmod.extended_amt)/ rsl.actual_quantity)/(1 + COALESCE(txl.tax_percentage, 0)), 2)),
				0)
			FROM
				[dbo].trl_rtl_price_mod dmod
			WHERE
				dmod.organization_id = trl.organization_id
				AND dmod.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
				AND dmod.rtl_loc_id = trl.rtl_loc_id
				AND dmod.wkstn_id = trl.wkstn_id
				AND dmod.business_date = trl.business_date
				AND dmod.trans_seq = trl.trans_seq
				AND dmod.void_flag = 0
				AND dmod.rtl_price_mod_reascode IN ('DEAL', 'LINE_ITEM_DISCOUNT'))
		END AS discounto,
		'Devoluciones' as Tipo
	FROM
		[dbo].trn_trans trn
	LEFT JOIN [dbo].trl_rtrans_lineitm trl ON
		trn.organization_id = trl.organization_id
		AND trn.rtl_loc_id = trl.rtl_loc_id
		AND trn.trans_seq = trl.trans_seq
		AND trn.wkstn_id = trl.wkstn_id
		AND trn.business_date = trl.business_date
	LEFT JOIN [dbo].trl_sale_lineitm tsl ON
		tsl.organization_id = trl.organization_id
		AND tsl.rtl_loc_id = trl.rtl_loc_id
		AND tsl.trans_seq = trl.trans_seq
		AND tsl.wkstn_id = trl.wkstn_id
		AND tsl.business_date = trl.business_date
		AND tsl.rtrans_lineitm_seq = trl.rtrans_lineitm_seq
	LEFT JOIN [dbo].trl_sale_tax_lineitm txl ON
		tsl.organization_id = txl.organization_id
		AND tsl.rtl_loc_id = txl.rtl_loc_id
		AND tsl.trans_seq = txl.trans_seq
		AND tsl.wkstn_id = txl.wkstn_id
		AND tsl.business_date = txl.business_date
		AND tsl.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
	LEFT JOIN [dbo].rpt_sale_line rsl ON
		tsl.organization_id = trl.organization_id
		AND tsl.rtl_loc_id = rsl.rtl_loc_id
		AND tsl.business_date = rsl.business_date
		AND tsl.wkstn_id = rsl.wkstn_id
		AND tsl.trans_seq = rsl.trans_seq
		AND tsl.rtrans_lineitm_seq = rsl.rtrans_lineitm_seq
	WHERE
		(
		SELECT
			Count(*)
		FROM
			[dbo].trn_trans_p
		WHERE
			trn_trans_p.property_code IN ('GLOBAL_SALE_FACTURA_NUMBER,GLOBAL_RETURN_FACTURA_NUMBER')
				AND tsl.organization_id = trn_trans_p.organization_id
				AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id
				AND tsl.trans_seq = trn_trans_p.trans_seq
				AND tsl.wkstn_id = trn_trans_p.wkstn_id
				AND tsl.business_date = trn_trans_p.business_date) = 0
		AND trn.organization_id IN (1001, 1003)
			AND trn.trans_statcode = 'COMPLETE'
			AND trn.trans_typcode = 'RETAIL_SALE'
			AND trn.post_void_flag = '0'
			AND trn.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
			AND trl.rtrans_lineitm_typcode = 'ITEM'
			AND trl.void_flag = '0'
			AND tsl.exclude_from_net_sales_flag = '0'
			AND tsl.sale_lineitm_typcode IN ('SALE', 'ORDER')
				AND tsl.item_id NOT IN ('000000000000009037', '000000000000009032', '000000000000147719', '000000000000009033', '000000000000147720', '9999981', '2103', '2104', '2105', '2106', '000000000000147718')
					AND tsl.item_id NOT IN (
					SELECT
						item_id
					FROM
						[dbo].itm_item_p itmp
					WHERE
						property_code = 'FACTURA_REQUIRED'
						AND tsl.organization_id = itmp.organization_id
						AND itmp.string_value != 'Y')
					AND (trn.total < 0
						AND trn.trans_seq NOT IN (
						SELECT
							trans_seq
						FROM
							[dbo].trn_trans_p
						WHERE
							property_code = 'ORDER_TRANSACTION_COMPLETED'
							AND tsl.organization_id = trn_trans_p.organization_id
							AND tsl.rtl_loc_id = trn_trans_p.rtl_loc_id
							AND tsl.trans_seq = trn_trans_p.trans_seq
							AND tsl.wkstn_id = trn_trans_p.wkstn_id
							AND tsl.business_date = trn_trans_p.business_date))
				GROUP BY
					tsl.trans_seq,
					trn.rtl_loc_id,
					trn.wkstn_id,
					trn.business_date,
					tsl.item_id,
					tsl.unit_price,
					rsl.gross_amt,
					rsl.quantity,
					txl.tax_percentage,
					rsl.actual_quantity,
					trl.organization_id,
					trl.rtrans_lineitm_seq,
					trl.rtl_loc_id,
					trl.wkstn_id,
					trl.business_date,
					trl.trans_seq
  ) AS Fact
group by
	fact.Tipo,
	fact.tienda,
	fact.fecha



UNION


 SELECT
	
	CASE WHEN (fact.tienda <= 99) THEN FORMAT(fact.tienda, '00') ELSE FORMAT(fact.tienda, '000') END storeId,
	FORMAT(fact.fecha, 'yyyy-MM-dd') businessDate,
  	NULL saleTypeSales,
	NULL totalMoneySale,
	NULL  totalUnitSale,
	NULL countInvoiceSale,
    NULL  saleTypeReturn,
	NULL totalMoneyReturn,
	NULL  totalUnitReturn,
	NULL  countInvoiceReturn,
	fact.Tipo saleTypeFreight,
	sum(Isnull((((Fact.itemtaxamt_h + fact.valorunitario ) * Fact.cantidad ) - ( ( fact.discounttaxamt_j + fact.discounto ) * Fact.cantidad ) ), 0)) totalMoneyFreight,
	SUM (Fact.cantidad) totalUnitFreight,
	COUNT (Fact.cantidad) countInvoiceFreight
FROM
	(
	select
		xom.trans_seq trn,
		xom.rtl_loc_id tienda,
		xom.wkstn_id caja,
		xom.business_date fecha,
		1 cantidad,
		(case
			when (
			select
				count(distinct xsm2.loc_id) total
			from
				xom_source_mod (nolock) xsm2
			where
				xsm2.order_id = xo.order_id) = 1 THEN
round((cast(xof.amount as DECIMAL(18, 6)))-(cast(xof.amount as DECIMAL(18, 6))/ cast(1 + txl.tax_percentage as decimal(18, 6))), 2)
			else
(case
				when (sum(xol.extended_price)/ xo.subtotal) >= 1 then
round((cast(xof.amount as DECIMAL(18, 6)))-(cast(xof.amount as DECIMAL(18, 6))/ cast(1 + txl.tax_percentage as decimal(18, 6))), 2)
				else
round(cast((xof.amount *(sum(xol.extended_price)/ xo.subtotal)) as DECIMAL(18, 6))-(cast((xof.amount *(sum(xol.extended_price)/ xo.subtotal)) as DECIMAL(18, 6))/ cast(1 + txl.tax_percentage as decimal(18, 6))), 2)
			end)
		end) itemtaxamt_h,
		cast(0.00 as decimal(18,
		2)) discounttaxamt_j,
		(case
			when (
			select
				count(distinct xsm2.loc_id) total
			from
				xom_source_mod xsm2
			where
				xsm2.order_id = xo.order_id) = 1 THEN
round((cast(xof.amount as DECIMAL(18, 6))/ cast(1 + txl.tax_percentage as decimal(18, 6))), 2)
			else
(case
				when (sum(xol.extended_price)/ xo.subtotal) >= 1 then
round((cast(xof.amount as DECIMAL(18, 6))/ cast(1 + txl.tax_percentage as decimal(18, 6))), 2)
				else
round((cast((xof.amount *(sum(xol.extended_price)/ xo.subtotal)) as DECIMAL(18, 6))/ cast(1 + txl.tax_percentage as decimal(18, 6))), 2)
			end)
		end) valorunitario,
		cast(0.00 as decimal(18,
		2)) discounto,
		'Fletes' Tipo
	from
		xom_order (nolock) xo
	join xom_order_line (nolock) xol on
		xo.order_id = xol.order_id
	join xom_source_mod xsm (nolock) on
		xol.order_id = xsm.order_id
			and xol.detail_seq = xsm.detail_seq
		join xom_order_mod xom (nolock) on
			xsm.order_id = xom.order_id
				and xsm.detail_seq = xom.detail_seq
			left join xom_order_fee xof (nolock) on
				xo.order_id = xof.order_id
			left join trl_sale_tax_lineitm txl (nolock) on
				xom.organization_id = txl.organization_id
					and xom.rtl_loc_id = txl.rtl_loc_id
					and xom.trans_seq = txl.trans_seq
					and xom.wkstn_id = txl.wkstn_id
					and xom.business_date = txl.business_date
					and xom.rtrans_lineitm_seq = txl.rtrans_lineitm_seq
				where
					xo.status_code = 'COMPLETE'
					and xof.detail_seq = 1
					and xom.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
					and xom.rtl_loc_id = '${data.storeId}'
				group by
					xom.rtl_loc_id,
					xom.wkstn_id,
					xom.trans_seq,
					xom.business_date,
					xof.detail_seq,
					xo.order_id,
					xo.subtotal,
					xof.amount,
					txl.tax_percentage
) AS Fact
group by
	fact.tipo,
	fact.tienda,
	fact.fecha


	`;
}
