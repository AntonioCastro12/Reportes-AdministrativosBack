import { CollaboratorsNazanDTO } from "../model/segments.dto";

export function collaboratosNazanQuery(data: CollaboratorsNazanDTO) {
	return `
   select
   _cst1.SIGNUP_RTL_LOC_ID AS store_id
   ,cust_seg.USER_QUERY_ID as segment
   ,_cst1.customer_num  as membership
   ,_cst1.CUST_ID AS client_id
   ,_cst1.SORT_FIRST_NAME AS first_name
   ,ISNULL(upper(_cst1.MIDDLE_NAME),'') as second_name
   ,_cst1.SORT_LAST_NAME AS last_name
   ,isnull(_cst1.second_Sort_last_name,'') AS second_last_name
   ,isnull(
   	(Select top 1(_cel.phone_num) 
   		from CST_CUST_PHONE as _cel (nolock) 
    	where _cel.organization_id = 1001 
	  	and _cel.cust_id      = _cst1.CUST_ID
	  	and _cel.phone_typcode = 'MOBILE'),
			isnull(
			(Select top 1(_cel.phone_num) 
				from CST_CUST_PHONE as _cel (nolock) 
				where _cel.organization_id = 1001 
				and _cel.cust_id      = _cst1.CUST_ID
				and _cel.phone_typcode = 'HOME'),'')) as cellphone_number
				
	 ,isnull(
	 	(Select top 1(_mail.email_addr) 
	 		from CST_EMAIL as _mail (nolock) 
    		where _mail.organization_id = 1001 
	  		and _mail.cust_id      = _cst1.CUST_ID
	  		and _mail.active_flag = 1),'') as mail
	  	
	,ISNULL(_cst1.BIRTH_DATE,'') AS birthday
	,ISNULL(_cst1.GENDER,'')  AS gender
	,ISNULL(_cst1.MARITAL_STATUS,'') AS marital_status
	,_cst1.SIGNUP_DATE as signup_date

 from cst_customer as _cst1 (nolock)
   
   left join [QRY_CUSTOMER_SEGMENT] as cust_seg (nolock)
  	on cust_seg.organization_id  = 1001
    and cust_seg.[USER_QUERY_ID] = '${data.segmentId}'  --- ID SEGMENTO
    and cust_seg.cust_id = _cst1.cust_id
    
  where _cst1.organization_id  = 1001
	and cust_seg.[USER_QUERY_ID] = '${data.segmentId}' --- ID SEGMENTO
	   
	
order by _cst1.SIGNUP_RTL_LOC_ID
    `;
}
