const { pool } = require('../config/db');
const { requireFields, positiveInteger } = require('../utils/validation');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fields = ['course_code', 'course_name', 'department_id', 'credits', 'semester'];
function validate(body) {
  requireFields(body, fields); positiveInteger(body.department_id, 'Department ID');
  if (!Number.isInteger(Number(body.credits)) || Number(body.credits) < 1 || Number(body.credits) > 10) { const e = new Error('Credits must be between 1 and 10.'); e.status = 400; throw e; }
  if (!Number.isInteger(Number(body.semester)) || Number(body.semester) < 1 || Number(body.semester) > 8) { const e = new Error('Semester must be between 1 and 8.'); e.status = 400; throw e; }
}
const select = 'SELECT c.*, d.department_name, COUNT(r.result_id) AS result_count FROM courses c JOIN departments d ON d.department_id=c.department_id LEFT JOIN results r ON r.course_id=c.course_id';
exports.getCourses = asyncHandler(async (req, res) => { const [rows] = await pool.query(`${select} GROUP BY c.course_id ORDER BY c.course_code`); res.json({ data: rows }); });
exports.getCourse = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Course ID'); const [[rows]] = await pool.query(`${select} WHERE c.course_id=? GROUP BY c.course_id`, [req.params.id]); if (!rows.length) return res.status(404).json({ message: 'Course not found.' }); res.json(rows[0]); });
exports.createCourse = asyncHandler(async (req, res) => { validate(req.body); const [r] = await pool.query(`INSERT INTO courses (${fields.join(',')}) VALUES (?,?,?,?,?)`, fields.map((f) => req.body[f])); res.status(201).json({ message: 'Course added successfully.', id: r.insertId }); });
exports.updateCourse = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Course ID'); validate(req.body); const [r] = await pool.query(`UPDATE courses SET ${fields.map((f) => `${f}=?`).join(', ')} WHERE course_id=?`, [...fields.map((f) => req.body[f]), req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: 'Course not found.' }); res.json({ message: 'Course updated successfully.' }); });
exports.deleteCourse = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Course ID'); const [r] = await pool.query('DELETE FROM courses WHERE course_id=?', [req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: 'Course not found.' }); res.json({ message: 'Course deleted successfully.' }); });
