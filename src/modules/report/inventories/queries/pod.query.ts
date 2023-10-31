import { mssqlInFilter } from "src/shared/helper/mssql.helper";
import { PODDTO } from "../model/inventories.dto";

export function podQuery(data: PODDTO) {
	return `
    SELECT

     originator_id  as T_ORIGEN

       ,inv_doc.originator_name AS NOMBRE_TDA_ORIGEN

       ,inv_doc.rtl_loc_id as T_DESTINO

       ,inv_doc.invctl_document_id AS 'L_EMBARQUE',

       CASE

            WHEN inv_doc.invctl_document_id NOT like 'TF%' and inv_doc.document_subtypcode = 'STORE_TRANSFER' THEN 'TRASPASO'

             WHEN inv_doc.invctl_document_id like 'TF%' and inv_doc.document_subtypcode = 'STORE_TRANSFER' THEN 'TRASP ENTRE TIENDAS'

            WHEN inv_doc.document_subtypcode = 'REPLENISHMENT' THEN 'LE CEDIS/CROSSDOCK'

             ELSE ''

       END  AS TIPO_EMBARQUE,

       CAST(inv_doc.create_date AS DATE) as FEC_CREA_SISTEMA,

       inv_docp.date_value as FEC_HORA_POD,

       inv_doc.update_date as FEC_HORA_CIERRE,

       DATEDIFF(hh,inv_docp.date_value,inv_doc.update_date) as TIEMPO_HRS,

       inv_doc.status_code AS ESTATUS

  FROM [inv_invctl_document] inv_doc

         left join [inv_invctl_document_p] inv_docp

         on inv_doc.organization_id = inv_docp.organization_id

           and inv_doc.rtl_loc_id = inv_docp.rtl_loc_id

             and inv_doc.document_typcode = inv_docp.document_typcode

             and inv_doc.invctl_document_id = inv_docp.invctl_document_id

             and inv_docp.property_code = 'POD_PRINTED_DATE'

  where inv_doc.organization_id = 1001

  

  and inv_doc.create_date >= GETDATE()-${data.days}

  and inv_doc.create_date <= GETDATE()

  and inv_doc.document_typcode = 'RECEIVING'

  ${mssqlInFilter(data.storeId, "inv_doc.rtl_loc_id ")}

  ORDER BY inv_doc.create_date
    `;
}
