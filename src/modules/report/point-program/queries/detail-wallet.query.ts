import { stringDateFormat } from "src/shared/helper/mssql.helper";
import { DetailWalletDTO } from "../model/point-program.dto";

export function detailWalletQuery(data: DetailWalletDTO) {
	return `
    
SET NOCOUNT ON

-- -----------------------------------------------------------------
-- DECLARACION DE LA BASE DE DATOS
-- -----------------------------------------------------------------
USE relate

-- -----------------------------------------------------------------
-- DECLARACION DE VARIABLES
-- -----------------------------------------------------------------
DECLARE @FechaIni SMALLDATETIME, @FechaFin SMALLDATETIME, @Tienda INT

-- -----------------------------------------------------------------
-- DEFINICION DE VARIABLES
-- -----------------------------------------------------------------
SET @FechaIni = '${stringDateFormat(data.startDate)}'	
SET @FechaFin = '${stringDateFormat(data.endDate)}'	
SET @Tienda = NULL


SELECT @FechaIni  = @FechaIni + ' 00:00'
SELECT @FechaFin  = @FechaFin + ' 23:59'

-- -----------------------------------------------------------------
-- CREACION DE TABLAS TEMPORALES
-- -----------------------------------------------------------------
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
IF @Tienda IS NULL
	BEGIN
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
	END
ELSE
	BEGIN
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
			AND AWA.RTL_LOC_ID = @Tienda
	END

-- -----------------------------------------------------------------
-- RESULT SET 2
-- -----------------------------------------------------------------
SELECT 
	CUSTOMER_NUM AS 'NUM SOCIO'
	,ISNULL(SORT_NAME,'N/A') AS 'NOM CORTO'
	,FULL_NAME AS 'NOMBRE SOCIO'
	,CST_CLASS_ID AS 'NIVEL'
	,CASE WHEN ACTIVITY_TYPECODE = 'AutomaticRedeem' THEN ACTIVITY_AMOUNT * (-1) 
	WHEN ACTIVITY_TYPECODE = 'IssueCoupon' THEN  ACTIVITY_AMOUNT * (1) END AS 'MONTO'
	,RTL_LOC_ID	AS 'TIENDA'
	,RTL_TRANS_SEQ AS 'TRANSACCION'
	,RTL_WKSTN_ID AS 'CAJA'
	,CREATE_DATE AS 'FECHA ACTIVIDAD'
	,CASE WHEN ACTIVITY_TYPECODE = 'AutomaticRedeem' THEN 'Monto Canjeado'
	 WHEN ACTIVITY_TYPECODE = 'IssueCoupon' THEN 'Monto Convertido' ELSE 'N/A' END 'ACTIVIDAD'
FROM 
	#Monedero 
ORDER BY 
	CREATE_DATE

-- -----------------------------------------------------------------
-- DEPURACION DE RECURSOS
-- -----------------------------------------------------------------
DROP TABLE #Monedero
    `;
}
