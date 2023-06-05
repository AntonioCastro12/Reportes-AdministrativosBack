import { sqlFilter } from 'src/shared/helper/sql.helper';
import { FrozenMonitorDTO } from '../frozen-monitor.dto';

export function frozenMonitorReportQuery(data: FrozenMonitorDTO) {
  return /*sql*/`
  USE xstore
  
  SELECT

  CASE WHEN (rtl_loc_id <= 99) THEN FORMAT(rtl_loc_id, '00') ELSE FORMAT(rtl_loc_id, '000') END storeId
  ,inv_count_id invCountId
  ,inv_location_id invLocationId
  ,inv_bucket_id invBucketId
  ,item_id itemId
  ,FORMAT(snapshot_date, 'yyyy-MM-dd') businessDate
  ,quantity qty

  FROM [dbo].[inv_count_snapshot]

  WHERE inv_count_id = '${data.invCountId}'

  AND CAST(snapshot_date AS DATE) = '${data.dateSelected}'

  ORDER BY snapshot_date, item_id
  `;
}
