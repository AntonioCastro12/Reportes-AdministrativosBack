import { mssqlFilter } from "src/shared/helper/mssql.helper";
import { GeneralSalesDTO, WholesaleSalesDTO } from "../model/sales.dto";

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

export function wholesaleSalesQuery(data: WholesaleSalesDTO) {
	return `

  -- -------------------------------------------------------------------------------------------
  -- INHIBIMOS EL EVENTO COUNT  
  -- -------------------------------------------------------------------------------------------
  SET NOCOUNT ON
  
  -- -------------------------------------------------------------------------------------------
  -- DEFINICION DE LA BASE DE DATOS
  -- -------------------------------------------------------------------------------------------
  use xstore
  
  -- --------------------------------------------------------------------
  -- CREACION DE TABLAS TEMPORALES
  -- --------------------------------------------------------------------
  CREATE TABLE #Trans
    (
      organization_id	INT
      ,rtl_loc_id	INT
      ,business_date	DATETIME
      ,wkstn_id	BIGINT
      ,trans_seq	BIGINT
      ,quantity DECIMAL(11,4)
    )
  
  CREATE TABLE #Trans1
    (
      organization_id	INT
      ,rtl_loc_id	INT
      ,business_date	DATETIME
      ,wkstn_id	BIGINT
      ,trans_seq	BIGINT
      ,quantity DECIMAL(11,4)
    )
  
  CREATE TABLE #Trans2
    (
      organization_id	INT
      ,rtl_loc_id	INT
      ,business_date	DATETIME
      ,wkstn_id	BIGINT
      ,trans_seq	BIGINT
      ,quantity DECIMAL(11,4)
    )
  
  CREATE TABLE #Trans3oMas
    (
      organization_id	INT
      ,rtl_loc_id	INT
      ,business_date	DATETIME
      ,wkstn_id	BIGINT
      ,trans_seq	BIGINT
      ,quantity DECIMAL(11,4)
    )
  
  CREATE TABLE #Trans_Employee
    (
      organization_id	INT
      ,rtl_loc_id	INT
      ,business_date	DATETIME
      ,wkstn_id	BIGINT
      ,trans_seq	BIGINT
      ,employee_party_id BIGINT
    )
  
  -- --------------------------------------------------------------------
  -- SE OBTIENEN LAS TRANSACCIONES COMPLETAS DE LAS FECHAS DEFINIDAS
  -- --------------------------------------------------------------------
  INSERT INTO #Trans

  SELECT
    trls.organization_id,
    trls.rtl_loc_id,
    trls.business_date,
    trls.wkstn_id,
    trls.trans_seq,
    SUM(trls.quantity)

  FROM 
    trl_sale_lineitm trls
      JOIN trl_commission_mod trlc ON
        trls.organization_id = trlc.organization_id AND
        trls.rtl_loc_id = trlc.rtl_loc_id AND
        trls.business_date = trlc.business_date AND
        trls.wkstn_id = trlc.wkstn_id AND
        trls.trans_seq = trlc.trans_seq AND
        trls.rtrans_lineitm_seq = trlc.rtrans_lineitm_seq
      JOIN trn_trans trn ON
        trls.organization_id=trn.organization_id AND
        trls.rtl_loc_id=trn.rtl_loc_id AND
        trls.business_date=trn.business_date AND
        trls.wkstn_id=trn.wkstn_id AND
        trls.trans_seq=trn.trans_seq 
      JOIN trl_rtrans_lineitm trlr ON
        trls.organization_id = trlr.organization_id AND
        trls.rtl_loc_id = trlr.rtl_loc_id AND
        trls.business_date = trlr.business_date AND
        trls.wkstn_id = trlr.wkstn_id AND
        trls.trans_seq = trlr.trans_seq AND
        trls.rtrans_lineitm_seq = trlr.rtrans_lineitm_seq

  WHERE 
    trls.business_date BETWEEN '${data.startDate}' AND '${data.endDate}'
    ${mssqlFilter(data.storeId, "trn.rtl_loc_id")} 
    AND trn.trans_statcode = 'COMPLETE' 
    AND trn.trans_typcode = 'RETAIL_SALE' 
    AND trls.sale_lineitm_typcode = 'SALE' 
    AND trls.return_flag != 1 
    AND trlr.void_flag != 1
  
    GROUP BY
    trls.organization_id,
    trls.rtl_loc_id,
    trls.business_date,
    trls.wkstn_id,
    trls.trans_seq
  
  -- --------------------------------------------------------------------
  -- SE OBTIENEN LAS TRANSACCIONES POR PARES VENDIDOS
  -- --------------------------------------------------------------------
  INSERT INTO #Trans1
  SELECT * FROM #Trans WHERE quantity = 1
  
  INSERT INTO #Trans2
  SELECT * FROM #Trans WHERE quantity = 2
  
  INSERT INTO #Trans3oMas
  SELECT * FROM #Trans WHERE quantity >= 3
  
  -- --------------------------------------------------------------------
  -- SE OBTIENEN LAS TRANSACCIONES PARA OBTENER QUE EMPELEADO TIENE LA VENTA
  -- --------------------------------------------------------------------
  INSERT INTO #Trans_Employee
  SELECT 
    trn.organization_id,
    trn.rtl_loc_id,
    trn.business_date,
    trn.wkstn_id,
    trn.trans_seq,
    trl.employee_party_id
  FROM 
    #Trans trn
      JOIN trl_commission_mod trl ON
        trn.organization_id=trl.organization_id AND
        trn.rtl_loc_id=trl.rtl_loc_id AND
        trn.business_date=trl.business_date AND
        trn.wkstn_id=trl.wkstn_id AND
        trn.trans_seq=trl.trans_seq
      JOIN rpt_sale_line rpt ON
         rpt.organization_id=trl.organization_id AND
        rpt.rtl_loc_id=trl.rtl_loc_id AND
        rpt.business_date=trl.business_date AND
        rpt.wkstn_id=trl.wkstn_id AND
        rpt.trans_seq=trl.trans_seq AND
        rpt.rtrans_lineitm_seq=trl.rtrans_lineitm_seq
  GROUP BY 
    trn.organization_id,
    trn.rtl_loc_id,
    trn.business_date,
    trn.wkstn_id,
    trn.trans_seq,
    trl.employee_party_id
  
  -- --------------------------------------------------------------------
  -- RESULT SET
  -- --------------------------------------------------------------------
  SELECT 
    TR.rtl_loc_id AS Tienda,
    TR.business_date AS Fecha,
    CRM.employee_id AS Num_Colaborador,
    ISNULL(CRM.first_name,'')+ ' ' +ISNULL(CRM.middle_name,'')+ ' ' +ISNULL(CRM.last_name,'')+ ' ' +ISNULL(CRM.last_name2,'') AS 'Colaborador',
    COUNT(TR.trans_seq) AS Transacciones_Totales,
    SUM(TR.quantity) AS Total_Pares,
    COUNT(TR1.trans_seq) AS Transacciones_1_Par,
    COUNT(TR2.trans_seq) AS Transacciones_2_Par,
    COUNT(TR3.trans_seq) AS Transacciones_3_o_Mas_Par,
    COUNT(TR2.trans_seq) + COUNT(TR3.trans_seq) Mayoreos
  FROM #Trans TR
    JOIN #Trans_Employee TRE ON
      TR.organization_id = TRE.organization_id AND
      TR.rtl_loc_id = TRE.rtl_loc_id AND
      TR.business_date = TRE.business_date AND
      TR.wkstn_id = TRE.wkstn_id AND
      TR.trans_seq = TRE.trans_seq
    LEFT JOIN #Trans1 TR1 ON
      TR.organization_id = TR1.organization_id AND
      TR.rtl_loc_id = TR1.rtl_loc_id AND
      TR.business_date = TR1.business_date AND
      TR.wkstn_id = TR1.wkstn_id AND
      TR.trans_seq = TR1.trans_seq
    LEFT JOIN #Trans2 TR2 ON
      TR.organization_id = TR2.organization_id AND
      TR.rtl_loc_id = TR2.rtl_loc_id AND
      TR.business_date = TR2.business_date AND
      TR.wkstn_id = TR2.wkstn_id AND
      TR.trans_seq = TR2.trans_seq
    LEFT JOIN #Trans3oMas TR3 ON
      TR.organization_id = TR3.organization_id AND
      TR.rtl_loc_id = TR3.rtl_loc_id AND
      TR.business_date = TR3.business_date AND
      TR.wkstn_id = TR3.wkstn_id AND
      TR.trans_seq = TR3.trans_seq
    JOIN crm_party CRM ON
      TRE.organization_id=CRM.organization_id AND
      TRE.employee_party_id=CRM.party_id
  GROUP BY 
    TR.rtl_loc_id,
    TR.business_date,
    CRM.employee_id,
    CRM.first_name,
    CRM.middle_name,
    CRM.last_name,
    CRM.last_name2
  ORDER BY
    TR.business_date,
    SUM(TR.quantity) DESC
  
  -- --------------------------------------------------------------------
  -- DEPURACION DE RECURSOS
  -- --------------------------------------------------------------------
  DROP TABLE #Trans
  DROP TABLE #Trans_Employee
  DROP TABLE #Trans1
  DROP TABLE #Trans2
  DROP TABLE #Trans3oMas
`;
}
