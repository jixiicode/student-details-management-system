const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try { await pool.query('SELECT 1'); console.log('Connected to MySQL database.'); }
  catch (error) { console.error('MySQL connection failed:', error.message); }
}
module.exports = { pool, testConnection };
