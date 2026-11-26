import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST     || 'localhost',
  port:     Number(process.env.MYSQL_PORT) || 3306,
  user:     process.env.MYSQL_USER     || 'dealership_user',
  password: process.env.MYSQL_PASSWORD || 'dealership_pass',
  database: process.env.MYSQL_DATABASE || 'dealership',
  charset:  'utf8mb4',
  waitForConnections: true,
  connectionLimit:    10,
  decimalNumbers:     true,
})

export default pool
