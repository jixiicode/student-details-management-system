require('dotenv').config();
const { read } = require('../src/config/store');

async function checkDatabase() {
  try {
    const data = read();
    const counts = {
      departments: data.departments.length,
      students: data.students.length,
      courses: data.courses.length,
      results: data.results.length
    };
    console.log('JSON datastore check passed.');
    console.table(counts);
  } catch (error) {
    console.error(`Database check failed${error.code ? ` (${error.code})` : ''}: ${error.message || String(error)}`);
    process.exitCode = 1;
  }
}
checkDatabase();
