import { stringDateFormat } from "src/shared/helper/mssql.helper";
import { TotalMovDTO } from "../model/point-program.dto";

export function totalMovementQuery(data: TotalMovDTO) {
	return `
    
SET NOCOUNT ON

-- -----------------------------------------------------------------
-- DECLARACION DE LA BASE DE DATOS
-- -----------------------------------------------------------------
USE relate

-- -----------------------------------------------------------------
-- DECLARACION DE VARIABLES
-- -----------------------------------------------------------------
DECLARE @FechaIni SMALLDATETIME, @FechaFin SMALLDATETIME

-- -----------------------------------------------------------------
-- DEFINICION DE VARIABLES
-- -----------------------------------------------------------------
SET @FechaIni = '${stringDateFormat(data.startDate)}'	
SET @FechaFin = '${stringDateFormat(data.endDate)}'	


SELECT @FechaIni  = @FechaIni + ' 00:00'
SELECT @FechaFin  = @FechaFin + ' 23:59'

-- -----------------------------------------------------------------
-- CREACION DE TABLAS TEMPORALES
-- -----------------------------------------------------------------
CREATE TABLE #Socios
	(
		CUST_ID VARCHAR(32)
		,CARD_NUM VARCHAR(64)
		,SORT_NAME VARCHAR(254)
		,FIRST_NAME VARCHAR(254)
		,LAST_NAME VARCHAR(254)
		,CST_CLASS_ID VARCHAR(32)
		,ORGANIZATION_ID NUMERIC
		--,PRIMARY KEY (CUST_ID)
	)

CREATE TABLE #Puntos_Ganados
	(
		CUST_ID VARCHAR(32)
		,NUM_PTS NUMERIC
		,RTL_LOC_ID INT
		,RTL_TRANS_SEQ INT
		,RTL_WKSTN_ID INT 
		,CREATE_DATE DATETIME
		,ACT_ACCT_ACTIVITY_TYPCODE VARCHAR(20)
		,ORGANIZATION_ID NUMERIC
	)

CREATE TABLE #Puntos_Canjeados
	(
		CUST_ID VARCHAR(32)
		,NUM_PTS NUMERIC
		,RTL_LOC_ID INT
		,RTL_TRANS_SEQ INT
		,RTL_WKSTN_ID INT 
		,CREATE_DATE DATETIME
		,ACT_ACCT_ACTIVITY_TYPCODE VARCHAR(20)
		,ORGANIZATION_ID NUMERIC
	)

CREATE TABLE #Bono_Inscripcion
	(
		CUST_ID VARCHAR(32)
		,CREATE_DATE DATETIME
		,NUM_PTS NUMERIC
		,PROGRAM_ID VARCHAR(32)
		,ACCOUNT_ID NUMERIC
		,RTL_LOC_ID INT
		,RTL_TRANS_SEQ INT
		,RTL_WKSTN_ID INT
		,LYLTY_RULE_ID NUMERIC
		,BONUS_PTS_BAL NUMERIC
	)

CREATE TABLE #Monedero
	(
		CUST_ID VARCHAR(32)
		,CUSTOMER_NUM NUMERIC
		,SORT_NAME VARCHAR(254)
		,FULL_NAME VARCHAR(254)
		,CST_CLASS_ID VARCHAR(32)
		,ACTIVITY_AMOUNT DECIMAL(5,2)
		,RTL_LOC_ID INT
		,RTL_TRANS_SEQ INT
		,RTL_WKSTN_ID INT
		,CREATE_DATE DATETIME
		,ACTIVITY_TYPECODE VARCHAR(32)
	)

-- -----------------------------------------------------------------
-- OBTENEMOS LOS SOCIOS QUE HAN TENIDO PUNTOS
-- -----------------------------------------------------------------
INSERT INTO #Socios
SELECT 
	LYL.CUST_ID
	,ACT.CARD_NUM
	,CST.SORT_NAME
	,CST.FIRST_NAME
	,CST.LAST_NAME
	,CST.CST_CLASS_ID
	,CST.ORGANIZATION_ID
FROM 
	LYL_LOYALTY_ACCT_ACT LYL (NOLOCK) 
		JOIN CST_CUSTOMER CST (NOLOCK) ON 
			LYL.CUST_ID = CST.CUST_ID AND
			LYL.ORGANIZATION_ID = CST.ORGANIZATION_ID
		JOIN ACT_CARD_CUST_MAP ACTM (NOLOCK) ON
			CST.CUST_ID=ACTM.CUST_ID AND
			CST.ORGANIZATION_ID=ACTM.ORGANIZATION_ID
		JOIN ACT_CARD ACT (NOLOCK) ON
			ACTM.CARD_SERIAL_NUM=ACT.CARD_SERIAL_NUM AND
			ACTM.ORGANIZATION_ID=ACT.ORGANIZATION_ID
WHERE 
	LYL.ORGANIZATION_ID = 1001  
	AND LYL.PROGRAM_ID = 512  
	AND LYL.CREATE_DATE >= '20221104'	--FECHA FIJA
	AND LYL.ACT_ACCT_ACTIVITY_TYPCODE != 'Award'
	AND LYL.CUST_ID IS NOT NULL
GROUP BY 
	LYL.CUST_ID
	,CST.SORT_NAME
	,CST.FIRST_NAME
	,CST.LAST_NAME
	,CST.CST_CLASS_ID
	,ACT.CARD_NUM
	,CST.ORGANIZATION_ID

-- -----------------------------------------------------------------
-- OBTENEMOS TOTAL DE PUNTOS QUE HAN GANADO LOS SOCIOS
-- -----------------------------------------------------------------
INSERT INTO #Puntos_Ganados
SELECT 
	S.CUST_ID
	,LYL.NUM_PTS
	,LYL.RTL_LOC_ID
	,LYL.RTL_TRANS_SEQ
	,LYL.RTL_WKSTN_ID
	,LYL.CREATE_DATE
	,LYL.ACT_ACCT_ACTIVITY_TYPCODE
	,LYL.ORGANIZATION_ID
FROM
	LYL_LOYALTY_ACCT_ACT LYL (NOLOCK) 
		JOIN #Socios S ON 
			LYL.ORGANIZATION_ID = S.ORGANIZATION_ID AND
			LYL.CUST_ID = S.CUST_ID
WHERE 
    LYL.ACT_ACCT_ACTIVITY_TYPCODE != 'Award'
	and LYL.CREATE_DATE >= '20221104'	--FECHA FIJA
	AND LYL.LYLTY_RULE_ID NOT IN (515,1516) 
	AND S.CUST_ID IS NOT NULL
	AND CREATE_DATE BETWEEN @FechaIni AND @FechaFin
--GROUP BY  S.CUST_ID
ORDER BY S.CUST_ID

-- -----------------------------------------------------------------
-- OBTENEMOS TOTAL DE PUNTOS QUE HAN CONVERTIDO EN PREMIO
-- -----------------------------------------------------------------
INSERT INTO #Puntos_Canjeados
SELECT
	S.CUST_ID
	,LYL.NUM_PTS
	,LYL.RTL_LOC_ID
	,LYL.RTL_TRANS_SEQ
	,LYL.RTL_WKSTN_ID
	,LYL.CREATE_DATE
	,LYL.ACT_ACCT_ACTIVITY_TYPCODE
	,LYL.ORGANIZATION_ID
FROM
	LYL_LOYALTY_ACCT_ACT LYL (NOLOCK) 
		JOIN #Socios S ON 
			LYL.ORGANIZATION_ID = S.ORGANIZATION_ID AND
			LYL.CUST_ID = S.CUST_ID
WHERE 
    LYL.ACT_ACCT_ACTIVITY_TYPCODE = 'Award'
	and LYL.CREATE_DATE >= '20221104'	--FECHA FIJA
	AND LYL.LYLTY_RULE_ID NOT IN (515,1516) 
	AND S.CUST_ID IS NOT NULL
	AND CREATE_DATE BETWEEN @FechaIni AND @FechaFin
--GROUP BY  S.CUST_ID
ORDER BY S.CUST_ID

-- -----------------------------------------------------------------
-- OBTENEMOS EL TOTAL DE PUNTOS CANJEADOS POR SOCIO
-- -----------------------------------------------------------------
INSERT INTO #Bono_Inscripcion
SELECT 
	CUST_ID
	,CREATE_DATE
	,NUM_PTS
	,PROGRAM_ID
	,ACCOUNT_ID
	,RTL_LOC_ID
	,RTL_TRANS_SEQ
	,RTL_WKSTN_ID
	,LYLTY_RULE_ID
	,BONUS_PTS_BAL
FROM 
	LYL_LOYALTY_ACCT_ACT (NOLOCK) 
WHERE 
	CREATE_DATE >= '20221104'	--FECHA FIJA
	AND LYLTY_RULE_ID IN (515,1516) 
	AND ACT_ACCT_ACTIVITY_TYPCODE = 'Issue' 
	AND NUM_PTS IN ('4000','8000')
	AND CREATE_DATE BETWEEN @FechaIni AND @FechaFin
GROUP BY 
	CUST_ID
	,CREATE_DATE
	,NUM_PTS
	,PROGRAM_ID
	,ACCOUNT_ID
	,RTL_LOC_ID
	,RTL_TRANS_SEQ
	,RTL_WKSTN_ID
	,LYLTY_RULE_ID
	,BONUS_PTS_BAL

-- -----------------------------------------------------------------
-- OBTENEMOS LOS SOCIOS QUE HAN TENIDO PUNTOS
-- -----------------------------------------------------------------
INSERT INTO #Monedero
SELECT
	cst.CUST_ID
	,cst.CUSTOMER_NUM 
	,cst.SORT_NAME
	,(cst.FIRST_NAME + ' ' + cst.LAST_NAME)
	,cst.CST_CLASS_ID
	,AWA.ACTIVITY_AMOUNT
	,AWA.RTL_LOC_ID
	,AWA.RTL_TRANS_SEQ
	,AWA.RTL_WKSTN_ID
	,AWA.CREATE_DATE
	,AWA.ACTIVITY_TYPECODE
FROM 
	ACT_CARD AC2 (NOLOCK)
		JOIN ACT_CARD_ACCT_MAP ACAM (NOLOCK) ON 
			AC2.ORGANIZATION_ID = ACAM.ORGANIZATION_ID AND 
			AC2.CARD_SERIAL_NUM = ACAM.CARD_SERIAL_NUM
		JOIN ACT_ACCOUNT AA (NOLOCK) ON 
			ACAM.ORGANIZATION_ID = AA.ORGANIZATION_ID AND 
			ACAM.ACCOUNT_ID = AA.ACCOUNT_ID
		JOIN AWD_ACCT_ACTIVITY AWA (NOLOCK) ON 
			AWA.ORGANIZATION_ID = AA.ORGANIZATION_ID AND 
			AWA.ACCOUNT_ID = AA.ACCOUNT_ID
		JOIN CST_CUSTOMER cst (NOLOCK) ON 
			cst.CUSTOMER_NUM =ac2.CARD_NUM AND 
			cst.ORGANIZATION_ID = AWA.ORGANIZATION_ID
WHERE 
	AC2.ORGANIZATION_ID = 1001
	AND AC2.CARD_TYPCODE = 'BRIGHTCARD'
	AND AA.ACCOUNT_TYPCODE = 'AWARD'
	AND awa.ACTIVITY_DATETIME >= '20221104'
	AND awa.VOID_FLAG = 0
	AND awa.ACTIVITY_TYPECODE in ( 'AutomaticRedeem','IssueCoupon')
	AND AWA.CREATE_DATE between @FechaIni and @FechaFin

-- -----------------------------------------------------------------
-- RESULT SET
-- -----------------------------------------------------------------
SELECT
	--A.CUST_ID
	A.CARD_NUM AS NUM_SOCIO
	,ISNULL(A.SORT_NAME,'N/A') AS NOM_CORTO
	,(A.FIRST_NAME + ' ' + A.LAST_NAME) AS NOMBRE_SOCIO
	,A.CST_CLASS_ID AS NIVEL
	,B.NUM_PTS AS PUNTOS_OTROGADOS
	,B.RTL_LOC_ID AS TIENDA
	,B.RTL_TRANS_SEQ AS TRANSACCION
	,B.RTL_WKSTN_ID AS CAJA
	,B.CREATE_DATE AS FECHA_ACTIVIDAD
	,CASE WHEN B.ACT_ACCT_ACTIVITY_TYPCODE = 'Issue' THEN 'Compra' 
	WHEN B.ACT_ACCT_ACTIVITY_TYPCODE = 'Return' THEN 'Devolucion' ELSE 'N/A' END AS ACTIVIDAD
FROM #Socios A
	JOIN #Puntos_Ganados B ON
		A.CUST_ID = B.CUST_ID AND
		A.ORGANIZATION_ID = B.ORGANIZATION_ID
WHERE 
	B.NUM_PTS != 0
	--AND A.CARD_NUM = '1112099501'
--ORDER BY
--	A.CUST_ID
--	,B.CREATE_DATE

---- --------------------
UNION ALL
---- --------------------

SELECT
	--A.CUST_ID
	A.CARD_NUM
	,ISNULL(A.SORT_NAME,'N/A')
	,(A.FIRST_NAME + ' ' + A.LAST_NAME)
	,A.CST_CLASS_ID
	,B.NUM_PTS
	,B.RTL_LOC_ID
	,B.RTL_TRANS_SEQ
	,B.RTL_WKSTN_ID
	,B.CREATE_DATE
	,CASE WHEN B.ACT_ACCT_ACTIVITY_TYPCODE = 'Award' THEN 'Premio' END
FROM #Socios A
	JOIN #Puntos_Canjeados B ON
		A.CUST_ID = B.CUST_ID AND
		A.ORGANIZATION_ID = B.ORGANIZATION_ID
WHERE 
	B.NUM_PTS != 0

---- --------------------
UNION ALL
---- --------------------

SELECT
	--A.CUST_ID
	A.CARD_NUM
	,ISNULL(A.SORT_NAME,'N/A')
	,(A.FIRST_NAME + ' ' + A.LAST_NAME)
	,A.CST_CLASS_ID
	,B.NUM_PTS
	,B.RTL_LOC_ID
	,B.RTL_TRANS_SEQ
	,B.RTL_WKSTN_ID
	,B.CREATE_DATE AS 'FECHA BONO'
	,'Bono'
FROM #Socios A 
	JOIN #Bono_Inscripcion B ON 
		A.CUST_ID=B.CUST_ID
WHERE 
	B.NUM_PTS != 0 
	--AND A.CARD_NUM = '1112099501'
ORDER BY 
	--A.CUST_ID
	B.CREATE_DATE

-- -----------------------------------------------------------------
-- RESULT SET 2
-- -----------------------------------------------------------------
SELECT 
	--CUST_ID
	CUSTOMER_NUM AS NUM_SOCIO
	,ISNULL(SORT_NAME,'N/A') AS NOM_CORTO
	,FULL_NAME AS NOMBRE_SOCIO
	,CST_CLASS_ID AS NIVEL
	,CASE WHEN ACTIVITY_TYPECODE = 'AutomaticRedeem' THEN ACTIVITY_AMOUNT * (-1) 
	WHEN ACTIVITY_TYPECODE = 'IssueCoupon' THEN  ACTIVITY_AMOUNT * (1) END AS MONTO
	,RTL_LOC_ID	AS TIENDA
	,RTL_TRANS_SEQ AS TRANSACCION
	,RTL_WKSTN_ID AS CAJA
	,CREATE_DATE AS FECHA_ACTIVIDAD
	,CASE WHEN ACTIVITY_TYPECODE = 'AutomaticRedeem' THEN 'Monto_Canjeado'
	 WHEN ACTIVITY_TYPECODE = 'IssueCoupon' THEN 'Monto Convertido' ELSE 'N/A' END ACTIVIDAD
FROM 
	#Monedero 
--WHERE 
--	CUSTOMER_NUM = '1112099501'
ORDER BY 
	--CUST_ID
	CREATE_DATE

-- -----------------------------------------------------------------
-- DEPURACION DE RECURSOS
-- -----------------------------------------------------------------
DROP TABLE #Socios
DROP TABLE #Puntos_Ganados
DROP TABLE #Monedero
DROP TABLE #Bono_Inscripcion
DROP TABLE #Puntos_Canjeados
    `;
}
