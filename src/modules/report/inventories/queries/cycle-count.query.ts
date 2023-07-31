import { mssqlFilter } from "src/shared/helper/mssql.helper";
import { CycleCountDTO } from "../model/inventories.dto";

export function cycleCountQuery(data: CycleCountDTO) {
	return `
    select

    invc.rtl_loc_id

       ,invc.inv_count_id as ID_CONTEO

    ,invc.inv_count_typcode as TIPO_CONTEO

       ,invc.description as MARCA

       ,cast(invc.begin_date as date) as FECHA_INICIAL

       ,cast(invc.end_date as date) as FECHA_FINAL

       ,invc.count_status

       ,(select count(invc_s.item_id) from inv_count_sheet_lineitm invc_s

             where invc_s.organization_id = invc.organization_id

                       and invc_s.rtl_loc_id     = invc.rtl_loc_id

               and invc_s.inv_count_id  = invc.inv_count_id

                       and invc_s.count_cycle = 1

                       group by invc_s.inv_count_id) as CANT_ITEMS

       from inv_count invc

    where invc.organization_id = 1001

   ${mssqlFilter(data.storeId, "invc.rtl_loc_id")}

   and invc.inv_count_typcode = '${data.type}'

   and CONVERT(CHAR(10),invc.begin_date,23) >= '${data.startDate}'

   and CONVERT(CHAR(10),invc.begin_date,23) <= '${data.endDate}'
   
    `;
}
