import { mssqlFilter } from "src/shared/helper/mssql.helper";
import { CollaboratorsNazanDTO } from "../model/segments.dto";

export function collaboratosNazanQuery() {
	return `
   
-- ---------------------------------------------------------------------
-- CREACION TABLAS TEMPORALES
-- ---------------------------------------------------------------------
CREATE TABLE #tempATRIBUTOS
	(
		ORGANIZATION_ID	INT
		,CUST_ID VARCHAR(32)
		,CUSTOMER_NUM VARCHAR(254)
		,CARD_NUM VARCHAR(64)
		,PARTY_TYPE_CODE VARCHAR(254)
		,CUSTOMER_GROUPS VARCHAR(254)
		,CUSTOMER_TYPE VARCHAR(254)
	)

-- ---------------------------------------------------------------------
-- OBTENEMOS LOS EMPLEADOS CON EL CUSTOMER_TYPE = EMPLEADO
-- ---------------------------------------------------------------------
SELECT
	A.ORGANIZATION_ID
	,A.CUST_ID
	,A.ATTRIBUTE_VALUE
	,B.CUSTOMER_NUM
	,D.CARD_NUM
	,'' AS PARTY_TYPE_CODE
	,'' AS CUSTOMER_GROUPS
	,A.ATTRIBUTE_VALUE AS CUSTOMER_TYPE
INTO #tempEMPLEADO
FROM 
	CST_CUST_ATTRIBUTES A WITH (NOLOCK)
		JOIN CST_CUSTOMER B WITH (NOLOCK) ON
			A.ORGANIZATION_ID = B.ORGANIZATION_ID AND
			A.CUST_ID = B.CUST_ID
		JOIN ACT_CARD_CUST_MAP C WITH (NOLOCK) ON
			B.ORGANIZATION_ID = C.ORGANIZATION_ID AND
			B.CUST_ID = C.CUST_ID AND
			C.CARD_TYPCODE = 'BRIGHTCARD'
		JOIN ACT_CARD D WITH (NOLOCK) ON
			C.ORGANIZATION_ID = D.ORGANIZATION_ID AND
			C.CARD_SERIAL_NUM = D.CARD_SERIAL_NUM
WHERE 
	A.ATTRIBUTE_ID = 56 AND 
	A.ATTRIBUTE_VALUE = 'EMPLEADO' AND
	A.ACTIVE_FLAG = 1 AND
	B.CUSTOMER_NUM = D.CARD_NUM
GROUP BY 
	A.ORGANIZATION_ID
	,A.CUST_ID
	,A.ATTRIBUTE_VALUE
	,B.CUSTOMER_NUM
	,D.CARD_NUM

-- ---------------------------------------------------------------------
-- OBTENEMOS LOS EMPLEADOS CON EL CUSTOMER_GROUPS = 10
-- ---------------------------------------------------------------------
SELECT
	A.ORGANIZATION_ID
	,A.CUST_ID
	,A.ATTRIBUTE_VALUE
	,B.CUSTOMER_NUM
	,D.CARD_NUM
	,'' AS PARTY_TYPE_CODE
	,A.ATTRIBUTE_VALUE AS CUSTOMER_GROUPS
	,'' AS CUSTOMER_TYPE
INTO #temp10
FROM 
	CST_CUST_ATTRIBUTES A WITH (NOLOCK)
		JOIN CST_CUSTOMER B WITH (NOLOCK) ON
			A.ORGANIZATION_ID = B.ORGANIZATION_ID AND
			A.CUST_ID = B.CUST_ID
		JOIN ACT_CARD_CUST_MAP C WITH (NOLOCK) ON
			B.ORGANIZATION_ID = C.ORGANIZATION_ID AND
			B.CUST_ID = C.CUST_ID AND
			C.CARD_TYPCODE = 'BRIGHTCARD'
		JOIN ACT_CARD D WITH (NOLOCK) ON
			C.ORGANIZATION_ID = D.ORGANIZATION_ID AND
			C.CARD_SERIAL_NUM = D.CARD_SERIAL_NUM
WHERE 
	A.ATTRIBUTE_ID = 58 AND 
	A.ATTRIBUTE_VALUE = '10' AND
	A.ACTIVE_FLAG = 1 AND
	B.CUSTOMER_NUM = D.CARD_NUM
GROUP BY 
	A.ORGANIZATION_ID
	,A.CUST_ID
	,A.ATTRIBUTE_VALUE
	,B.CUSTOMER_NUM
	,D.CARD_NUM

-- ---------------------------------------------------------------------
-- OBTENEMOS LOS EMPLEADOS CON EL PARTY_TYPE_CODE = EMPLOYEE
-- ---------------------------------------------------------------------
SELECT
	A.ORGANIZATION_ID
	,A.CUST_ID
	,A.ATTRIBUTE_VALUE
	,B.CUSTOMER_NUM
	,D.CARD_NUM
	,A.ATTRIBUTE_VALUE AS PARTY_TYPE_CODE
	,'' AS CUSTOMER_GROUPS
	,'' AS CUSTOMER_TYPE
INTO #tempEMPLOYEE
FROM 
	CST_CUST_ATTRIBUTES A WITH (NOLOCK)
		JOIN CST_CUSTOMER B WITH (NOLOCK) ON
			A.ORGANIZATION_ID = B.ORGANIZATION_ID AND
			A.CUST_ID = B.CUST_ID
		JOIN ACT_CARD_CUST_MAP C WITH (NOLOCK) ON
			B.ORGANIZATION_ID = C.ORGANIZATION_ID AND
			B.CUST_ID = C.CUST_ID AND
			C.CARD_TYPCODE = 'BRIGHTCARD'
		JOIN ACT_CARD D WITH (NOLOCK) ON
			C.ORGANIZATION_ID = D.ORGANIZATION_ID AND
			C.CARD_SERIAL_NUM = D.CARD_SERIAL_NUM
WHERE 
	A.ATTRIBUTE_ID = 4 AND 
	A.ATTRIBUTE_VALUE = 'EMPLOYEE' AND
	A.ACTIVE_FLAG = 1 AND
	B.CUSTOMER_NUM = D.CARD_NUM
GROUP BY 
	A.ORGANIZATION_ID
	,A.CUST_ID
	,A.ATTRIBUTE_VALUE
	,B.CUSTOMER_NUM
	,D.CARD_NUM

-- ---------------------------------------------------------------------
-- INSERTAMOS LA INFORMACION OBTENIDA EN UNA TABLA DE TRABAJO PARA MEJOR MANEJO
-- ---------------------------------------------------------------------
INSERT INTO #tempATRIBUTOS
SELECT ORGANIZATION_ID,CUST_ID,CUSTOMER_NUM,CARD_NUM,PARTY_TYPE_CODE,CUSTOMER_GROUPS,CUSTOMER_TYPE FROM #tempEMPLEADO
INSERT INTO #tempATRIBUTOS
SELECT ORGANIZATION_ID,CUST_ID,CUSTOMER_NUM,CARD_NUM,PARTY_TYPE_CODE,CUSTOMER_GROUPS,CUSTOMER_TYPE FROM #temp10
INSERT INTO #tempATRIBUTOS
SELECT ORGANIZATION_ID,CUST_ID,CUSTOMER_NUM,CARD_NUM,PARTY_TYPE_CODE,CUSTOMER_GROUPS,CUSTOMER_TYPE FROM #tempEMPLOYEE

-- ---------------------------------------------------------------------
-- RESULT SET
-- ---------------------------------------------------------------------
SELECT 
	A.ORGANIZATION_ID	
	,A.CUST_ID	
	,A.CARD_NUM
	,ISNULL(B.FIRST_NAME,'') FIRST_NAME
	,ISNULL(B.MIDDLE_NAME,'') MIDDLE_NAME
	,ISNULL(B.LAST_NAME,'') LAST_NAME
	,ISNULL(B.last_name2,'') last_name2
	,MAX(A.PARTY_TYPE_CODE) PARTY_TYPE_CODE
	,MAX(A.CUSTOMER_GROUPS) CUSTOMER_GROUPS
	,MAX(A.CUSTOMER_TYPE) CUSTOMER_TYPE
FROM 
	#tempATRIBUTOS A
		JOIN CST_CUSTOMER B ON
			A.ORGANIZATION_ID= B.ORGANIZATION_ID AND
			A.CUST_ID = B.CUST_ID AND
			A.CUSTOMER_NUM = B.CUSTOMER_NUM
GROUP BY 
	A.ORGANIZATION_ID	
	,A.CUST_ID	
	,A.CUSTOMER_NUM	
	,A.CARD_NUM	
	,B.FIRST_NAME
	,B.MIDDLE_NAME
	,B.LAST_NAME
	,B.last_name2

-- ---------------------------------------------------------------------
-- DEPURACION DE RECURSOS
-- ---------------------------------------------------------------------
DROP TABLE #tempEMPLEADO
DROP TABLE #temp10
DROP TABLE #tempEMPLOYEE
DROP TABLE #tempATRIBUTOS
    `;
}
