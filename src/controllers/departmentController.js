const { read, write, nextId, now, error } = require('../config/store');
const { requireFields, positiveInteger } = require('../utils/validation');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const validate = (body) => requireFields(body, ['department_name', 'department_code']);

function duplicate(data, body, exceptId) {
  return data.departments.some((department) => department.department_id !== exceptId &&
    (department.department_name.toLowerCase() === String(body.department_name).trim().toLowerCase() || department.department_code.toLowerCase() === String(body.department_code).trim().toLowerCase()));
}

exports.getDepartments = asyncHandler(async (req, res) => {
  const data = read();
  const rows = data.departments.map((department) => ({
    ...department,
    student_count: data.students.filter((student) => student.department_id === department.department_id).length,
    course_count: data.courses.filter((course) => course.department_id === department.department_id).length
  })).sort((a, b) => a.department_name.localeCompare(b.department_name));
  res.json({ data: rows });
});

exports.getDepartment = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Department ID');
  const department = read().departments.find((entry) => entry.department_id === Number(req.params.id));
  if (!department) return res.status(404).json({ message: 'Department not found.' });
  res.json(department);
});

exports.createDepartment = asyncHandler(async (req, res) => {
  validate(req.body);
  const data = read();
  if (duplicate(data, req.body)) throw error('A record with one of these unique values already exists.', 409);
  const id = nextId(data.departments, 'department_id'); const timestamp = now();
  data.departments.push({ department_id: id, department_name: String(req.body.department_name).trim(), department_code: String(req.body.department_code).trim(), created_at: timestamp, updated_at: timestamp });
  write(data); res.status(201).json({ message: 'Department added successfully.', id });
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Department ID'); validate(req.body);
  const data = read(); const department = data.departments.find((entry) => entry.department_id === Number(req.params.id));
  if (!department) return res.status(404).json({ message: 'Department not found.' });
  if (duplicate(data, req.body, department.department_id)) throw error('A record with one of these unique values already exists.', 409);
  department.department_name = String(req.body.department_name).trim(); department.department_code = String(req.body.department_code).trim(); department.updated_at = now();
  write(data); res.json({ message: 'Department updated successfully.' });
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Department ID'); const id = Number(req.params.id); const data = read();
  const index = data.departments.findIndex((entry) => entry.department_id === id);
  if (index === -1) return res.status(404).json({ message: 'Department not found.' });
  if (data.students.some((student) => student.department_id === id) || data.courses.some((course) => course.department_id === id)) throw error('This record is still referenced by another record and cannot be deleted.', 409);
  data.departments.splice(index, 1); write(data); res.json({ message: 'Department deleted successfully.' });
});
