import { TransactionMonitorDTO } from '../transaction-monitor.dto';

export function transactionMonitorXHubSaleReportQuery(
  data: TransactionMonitorDTO,
) {
  return /*sql*/ `
  USE xstore
  
  SELECT 
  
        DISTINCT CASE WHEN (xsth.store_id <= 99) THEN FORMAT(xsth.store_id, '00') ELSE FORMAT(xsth.store_id, '000') END xhub_storeId,
				xsth.workstation_id      AS xhub_workstation,
				FORMAT(xsth.business_Date, 'yyyy-MM-dd')		 AS xhub_businessDate,
				xsth.trans_seq_num       AS xhub_transSeq,
                xstsli.item_id           AS xhub_productId,
                Sum(xstsli.quantity)     AS xhub_qty,
                Sum(xstsli.extended_amt) AS xhub_total
  FROM   xhub_stg_trans_hdr xsth
        JOIN xhub_stg_trl_rtrans xstr
          ON xsth.stg_header_id = xstr.stg_header_id
              AND xsth.organization_id = xstr.organization_id
              AND xsth.store_id = xstr.store_id
              AND xsth.workstation_id = xstr.workstation_id
              AND xsth.business_date = xstr.business_date
              AND xsth.trans_seq_num = xstr.trans_seq_num
        JOIN xhub_stg_trl_rtrans_ln_itm xstrli
          ON xsth.stg_header_id = xstrli.stg_header_id
              AND xsth.organization_id = xstrli.organization_id
              AND xsth.store_id = xstrli.store_id
              AND xsth.workstation_id = xstrli.workstation_id
              AND xsth.business_date = xstrli.business_date
              AND xsth.trans_seq_num = xstrli.trans_seq_num
        JOIN xhub_stg_trl_sale_ln_itm xstsli
          ON xstrli.stg_header_id = xstsli.stg_header_id
              AND xstrli.organization_id = xstsli.organization_id
              AND xstrli.store_id = xstsli.store_id
              AND xstrli.workstation_id = xstsli.workstation_id
              AND xstrli.business_date = xstsli.business_date
              AND xstrli.trans_seq_num = xstsli.trans_seq_num
              AND xstrli.ln_itm_seq_num = xstsli.ln_itm_seq_num
        LEFT JOIN (SELECT stg_header_id, store_id, workstation_id, business_date, trans_seq_num, ln_itm_seq_num, Sum(amount) amount
                    FROM xhub_stg_trl_rtl_prc_mod
                    WHERE action = 'Subtract'
                    GROUP BY stg_header_id, store_id, workstation_id, business_date, trans_seq_num, ln_itm_seq_num) xstrpm
                ON xstsli.stg_header_id = xstrpm.stg_header_id
                  AND xstsli.store_id = xstrpm.store_id
                  AND xstsli.workstation_id = xstrpm.workstation_id
                  AND xstsli.business_date = xstrpm.business_date
                  AND xstsli.trans_seq_num = xstrpm.trans_seq_num
                  AND xstrli.ln_itm_seq_num = xstrpm.ln_itm_seq_num
        LEFT JOIN F_post_void_trans_r('${data.storeInfoId}', '${data.startDate}', '${data.endDate}') xfpvt
                ON xsth.trans_seq_num = xfpvt.trans_seq_num
                  AND xsth.workstation_id = xfpvt.workstation_id
  WHERE  xsth.business_date between '${data.startDate}' and '${data.endDate}'
        AND xsth.trans_type_cd = 'RETAIL_SALE'
        AND xsth.cancel_flag = '0'
        AND xsth.store_id = ${data.storeInfoId}
        AND xstr.trans_status_cd = 'Delivered'
        AND NOT (xstr.trans_total <= 0 AND xstsli.sale_ln_itm_type_cd = 'PREV_LAYAWAY')
        AND xstrli.ln_itm_typ_cd = 'ITEM'
        AND xstrli.void_flag = 0
        AND xstsli.sale_ln_itm_type_cd IN ('SALE', 'PREV_LAYAWAY')
        AND xstsli.itm_type_code IN ('Stock', 'dtv:NonMerchandise', 'Fee')
        AND xstsli.item_id not in ('000000000000147718')
        AND xfpvt.trans_seq_num IS NULL
  GROUP  BY xsth.store_id, xsth.workstation_id, xsth.business_Date, xsth.trans_seq_num, xstsli.item_id
  ORDER  BY xsth.trans_seq_num
  `;
}
