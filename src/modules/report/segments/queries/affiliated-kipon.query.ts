import { mssqlInFilter } from "src/shared/helper/mssql.helper";
import { AffiliatedKiponDTO } from "../model/segments.dto";

export function affiliatedKiponQuery(data: AffiliatedKiponDTO) {
	return `
  
    select
   _cst1.SIGNUP_RTL_LOC_ID AS store_id,
   act.CARD_NUM as membership,
   _cst1.CUST_ID AS cust_id,
   _cst1.SORT_FIRST_NAME AS first_name,
   ISNULL(upper(_cst1.MIDDLE_NAME),'') as second_name,
   _cst1.SORT_LAST_NAME AS surname,
   isnull(_cst1.second_Sort_last_name,'') AS lastname
   ,isnull((Select top 1(_cel.phone_num) from CST_CUST_PHONE as _cel (nolock) 
                                                             where _cel.organization_id = 1003 
                                                                   and _cel.cust_id      = _cst1.CUST_ID
                                                                   and _cel.phone_typcode = 'HOME'),'') as home_phone
  ,isnull((Select top 1(_cel.phone_num) from CST_CUST_PHONE as _cel (nolock) 
                                                             where _cel.organization_id = 1003 
                                                                   and _cel.cust_id      = _cst1.CUST_ID
                                                                   and _cel.phone_typcode = 'MOBILE'),'') as cel_phone
 ,isnull((Select top 1(_cel.phone_num) from CST_CUST_PHONE as _cel (nolock) 
                                                             where _cel.organization_id = 1003 
                                                                   and _cel.cust_id      = _cst1.CUST_ID
                                                                   and _cel.phone_typcode = 'BUSINESS'),'') as business_phone
       ,isnull((Select top 1(_mail.email_addr) from CST_EMAIL as _mail (nolock) 
    where _mail.organization_id = 1003
         and _mail.cust_id      = _cst1.CUST_ID
         and _mail.active_flag = 1),'') as email
       ,ISNULL(CONVERT(VARCHAR(30),_cst1.BIRTH_DATE),'') AS birthday
       ,ISNULL(_cst1.GENDER,'')  AS gender
       ,ISNULL(_cst1.MARITAL_STATUS,'') AS status
       ,_cst1.SIGNUP_DATE as signup_date
   from cst_customer as _cst1 (nolock)
 
   left  join [QRY_CUSTOMER_SEGMENT] as cust_seg (nolock)
  on cust_seg.organization_id  = _cst1.ORGANIZATION_ID
    and cust_seg.cust_id = _cst1.cust_id
 
    left join ACT_CARD_CUST_MAP actm (nolock) on
		actm.ORGANIZATION_ID = _cst1.ORGANIZATION_ID
		and actm.CUST_ID = _cst1.CUST_ID
 
	left join ACT_CARD act (nolock) on
		act.ORGANIZATION_ID = actm.ORGANIZATION_ID
		and act.CARD_TYPCODE = actm.CARD_TYPCODE
		and act.CARD_SERIAL_NUM = actm.CARD_SERIAL_NUM
    
	where CAST(_cst1.SIGNUP_DATE AS DATE) BETWEEN '${data.startDate}' AND '${
		data.endDate
	}'

    ${mssqlInFilter(data.storeId, "_cst1.SIGNUP_RTL_LOC_ID")}
	and cust_seg.organization_id  = 1003
    and cust_seg.[USER_QUERY_ID] = 1 
    order by _cst1.SIGNUP_RTL_LOC_ID
    `;
}
