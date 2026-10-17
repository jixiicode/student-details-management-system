const { pool } = require('../config/db');
const { requireFields, positiveInteger, validEmail } = require('../utils/validation');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fields = ['enrollment_no', 'full_name', 'email', 'phone', 'date_of_birth', 'gender', 'department_id', 'admission_date', 'current_semester', 'address'];

function validate(body) {
  requireFields(body, fields); validEmail(body.email); positiveInteger(body.department_id, 'Department ID');
  if (!['Male', 'Female', 'Other'].includes(body.gender)) { const e = new Error('Gender must be Male, Female, or Other.'); e.status = 400; throw e; }
  if (Number(body.current_semester) < 1 || Number(body.current_semester) > 8) { const e = new Error('Current semester must be between 1 and 8.'); e.status = 400; throw e; }
}
const values = (b) => [b.enrollment_no, b.full_name, b.email, b.phone, b.date_of_birth, b.gender, b.department_id, b.admission_date, b.current_semester, b.address];
const select = `SELECT s.*, d.department_name, d.department_code FROM students s JOIN departments d ON d.department_id=s.department_id`;

exports.getStudents = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10)); const offset = (page - 1) * limit;
  const sortBy = ['full_name', 'enrollment_no', 'admission_date', 'current_semester'].includes(req.query.sortBy) ? req.query.sortBy : 'student_id';
  const direction = String(req.query.order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const search = String(req.query.search || '').trim(); const departmentId = req.query.department_id;
  const where = []; const params = [];
  if (search) { where.push('(s.full_name LIKE ? OR s.enrollment_no LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (departmentId) { where.push('s.department_id = ?'); params.push(departmentId); }
  const clause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const [[count], [rows]] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS count FROM students s${clause}`, params),
    pool.query(`${select}${clause} ORDER BY s.${sortBy} ${direction} LIMIT ? OFFSET ?`, [...params, limit, offset])
  ]);
  res.json({ data: rows, pagination: { page, limit, total: count.count, pages: Math.ceil(count.count / limit) } });
});
exports.getStudent = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Student ID'); const [[rows], [results]] = await Promise.all([
    pool.query(`${select} WHERE s.student_id=?`, [req.params.id]),
    pool.query(`SELECT r.*, c.course_code, c.course_name FROM results r JOIN courses c ON c.course_id=r.course_id WHERE r.student_id=? ORDER BY r.created_at DESC`, [req.params.id])
  ]);
  if (!rows.length) return res.status(404).json({ message: 'Student not found.' });
  res.json({ ...rows[0], results });
});
exports.createStudent = asyncHandler(async (req, res) => {
  validate(req.body); const [result] = await pool.query(`INSERT INTO students (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`, values(req.body));
  const [[student]] = await pool.query(`${select} WHERE s.student_id=?`, [result.insertId]); res.status(201).json({ message: 'Student added successfully.', data: student });
});
exports.updateStudent = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Student ID'); validate(req.body); const [result] = await pool.query(`UPDATE students SET ${fields.map((f) => `${f}=?`).join(', ')} WHERE student_id=?`, [...values(req.body), req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Student not found.' }); res.json({ message: 'Student updated successfully.' });
});
exports.deleteStudent = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Student ID'); const [result] = await pool.query('DELETE FROM students WHERE student_id=?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Student not found.' }); res.json({ message: 'Student deleted successfully.' });
});
