require('dotenv').config();
const { pool } = require('../src/config/db');

async function checkDatabase() {
  try {
    const [[summary]] = await pool.query(`
      SELECT DATABASE() AS database_name,
             COUNT(*) AS table_count
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name IN ('departments', 'students', 'courses', 'results')
    `);
    if (summary.table_count !== 4) throw new Error(`Expected 4 application tables but found ${summary.table_count}. Import database.sql first.`);

    const [[counts]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM departments) AS departments,
        (SELECT COUNT(*) FROM students) AS students,
        (SELECT COUNT(*) FROM courses) AS courses,
        (SELECT COUNT(*) FROM results) AS results
    `);
    console.log(`Database check passed: ${summary.database_name}`);
    console.table(counts);
  } catch (error) {
    console.error(`Database check failed${error.code ? ` (${error.code})` : ''}: ${error.message || String(error)}`);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
checkDatabase();
