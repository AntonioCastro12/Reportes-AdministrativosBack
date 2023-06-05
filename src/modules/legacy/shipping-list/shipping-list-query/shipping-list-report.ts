import { ShippingListDTO } from '../shipping-list.dto';

export function shippingListReportQuery(data: ShippingListDTO) {
  return /*sql*/ `
  USE xstore
  
  SELECT 
       CASE WHEN (doc_hdr.[rtl_loc_id] <= 99) THEN FORMAT(doc_hdr.[rtl_loc_id], '00') ELSE FORMAT(doc_hdr.[rtl_loc_id], '000') END storeId,
       doc_hdr.[document_typcode]                       documentType,
       Cast(doc_hdr.last_activity_date as date)         updateDate,
       doc_hdr.[invctl_document_id]                     documentId,
       doc_det.[carton_id]                              package,
       doc_det.[inventory_item_id]                      itemId,
       doc_det.[unit_count]                             totalRequested,
       doc_det.[expected_count]                         totalExpected,
       doc_det.[posted_count]                           totalReceived,
       Isnull((select Sum(inv_j.quantity)
               from   [inv_inventory_journal] INV_J
               where  doc_det.organization_id = INV_J.organization_id
                      and doc_det.rtl_loc_id = INV_J.rtl_loc_id
                      and inv_hdr.business_date = INV_J.business_date
                      and inv_hdr.wkstn_id = INV_J.wkstn_id
                      and inv_hdr.trans_seq = INV_J.trans_seq
                      and doc_det.invctl_document_line_nbr = INV_J.trans_lineitm_seq
                      and doc_det.document_typcode = inv_j.action_code
                      and doc_det.inventory_item_id = inv_j.[inventory_item_id]
               group  by INV_J.trans_seq,
                         INV_J.trans_lineitm_seq,
                         inv_j.[inventory_item_id]), 0) affected,
       Isnull(doc_det.[original_bucket_id], 'N/I')      bucketAffected,
       doc_hdr.[create_date]                            createDate,
       doc_hdr.[status_code]                            status,
       doc_det.[invctl_document_line_nbr]               lineNumber

FROM   inv_invctl_trans inv_hdr (nolock)
       join [inv_invctl_document] doc_hdr (nolock)
         on doc_hdr.organization_id = inv_hdr.organization_id
            and inv_hdr.rtl_loc_id = doc_hdr.rtl_loc_id
            and inv_hdr.invctl_document_id = doc_hdr.invctl_document_id
            and inv_hdr.document_typcode = doc_hdr.document_typcode
       join [inv_invctl_document_lineitm] doc_det (nolock)
         on doc_hdr.[invctl_document_id] = doc_det.[invctl_document_id]

WHERE  doc_hdr.document_typcode = '${data.documentType}'
       and inv_hdr.new_status_code = 'CLOSED'
       and doc_hdr.[invctl_document_id] LIKE '%${data.documentId}%'

ORDER BY doc_det.[invctl_document_line_nbr]
`;
}
