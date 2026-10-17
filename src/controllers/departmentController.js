const { pool } = require('../config/db');
const { requireFields, positiveInteger } = require('../utils/validation');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function validate(body) { requireFields(body, ['department_name', 'department_code']); }

exports.getDepartments = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`SELECT d.*, COUNT(DISTINCT s.student_id) AS student_count, COUNT(DISTINCT c.course_id) AS course_count
    FROM departments d LEFT JOIN students s ON s.department_id=d.department_id LEFT JOIN courses c ON c.department_id=d.department_id GROUP BY d.department_id ORDER BY d.department_name`); res.json({ data: rows });
});
exports.getDepartment = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Department ID'); const [[rows]] = await pool.query('SELECT * FROM departments WHERE department_id=?', [req.params.id]); if (!rows.length) return res.status(404).json({ message: 'Department not found.' }); res.json(rows[0]); });
exports.createDepartment = asyncHandler(async (req, res) => { validate(req.body); const [r] = await pool.query('INSERT INTO departments (department_name, department_code) VALUES (?,?)', [req.body.department_name, req.body.department_code]); res.status(201).json({ message: 'Department added successfully.', id: r.insertId }); });
exports.updateDepartment = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Department ID'); validate(req.body); const [r] = await pool.query('UPDATE departments SET department_name=?, department_code=? WHERE department_id=?', [req.body.department_name, req.body.department_code, req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: 'Department not found.' }); res.json({ message: 'Department updated successfully.' }); });
exports.deleteDepartment = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Department ID'); const [r] = await pool.query('DELETE FROM departments WHERE department_id=?', [req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: 'Department not found.' }); res.json({ message: 'Department deleted successfully.' }); });
