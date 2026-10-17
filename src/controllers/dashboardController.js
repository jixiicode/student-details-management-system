const { pool } = require('../config/db');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.getDashboard = asyncHandler(async (req, res) => {
  const [[students], [departments], [courses], [average], [recent]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS count FROM students'),
    pool.query('SELECT COUNT(*) AS count FROM departments'),
    pool.query('SELECT COUNT(*) AS count FROM courses'),
    pool.query('SELECT ROUND(AVG(marks_obtained / maximum_marks * 100), 2) AS score FROM results'),
    pool.query(`SELECT s.student_id, s.enrollment_no, s.full_name, s.email, s.admission_date, d.department_name
                FROM students s JOIN departments d ON d.department_id = s.department_id
                ORDER BY s.created_at DESC LIMIT 5`)
  ]);
  res.json({ totals: { students: students[0].count, departments: departments[0].count, courses: courses[0].count, averageScore: average[0].score || 0 }, recentStudents: recent });
});
