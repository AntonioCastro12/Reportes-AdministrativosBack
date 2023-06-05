export const oracleAtgConnectionObject = {
  user: process.env.ATG_DB_USER,
  password: process.env.ATG_DB_PASSWORD,
  connectString: process.env.ATG_CONNECTION_STRING,
  database: process.env.ATG_DB_NAME,
  // fetchArraySize: 1000,
  // prefetchRows: 1000
};

export const oracleOBConnectionObject = {
  user: process.env.ORDER_DB_USER,
  password: process.env.ORDER_DB_PASSWORD,
  connectString: process.env.ORDER_CONNECTION_STRING,
  database: process.env.ORDER_DB_NAME,
};
