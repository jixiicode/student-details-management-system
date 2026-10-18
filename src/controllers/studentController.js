const { read, write, nextId, now, error } = require('../config/store');
const { requireFields, positiveInteger, validEmail } = require('../utils/validation');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fields = ['enrollment_no', 'full_name', 'email', 'phone', 'date_of_birth', 'gender', 'department_id', 'admission_date', 'current_semester', 'address'];

function validate(body) {
  requireFields(body, fields); validEmail(body.email); positiveInteger(body.department_id, 'Department ID');
  if (!['Male', 'Female', 'Other'].includes(body.gender)) throw error('Gender must be Male, Female, or Other.');
  if (!Number.isInteger(Number(body.current_semester)) || Number(body.current_semester) < 1 || Number(body.current_semester) > 8) throw error('Current semester must be between 1 and 8.');
}
function view(data, student) { const department = data.departments.find((entry) => entry.department_id === student.department_id); return { ...student, department_name: department?.department_name || '', department_code: department?.department_code || '' }; }
function fromBody(body) { return { enrollment_no: String(body.enrollment_no).trim(), full_name: String(body.full_name).trim(), email: String(body.email).trim(), phone: String(body.phone).trim(), date_of_birth: body.date_of_birth, gender: body.gender, department_id: Number(body.department_id), admission_date: body.admission_date, current_semester: Number(body.current_semester), address: String(body.address).trim() }; }
function assertRelated(data, body) { if (!data.departments.some((department) => department.department_id === Number(body.department_id))) throw error('Department not found.', 400); }
function duplicate(data, body, exceptId) { return data.students.some((student) => student.student_id !== exceptId && (student.enrollment_no.toLowerCase() === String(body.enrollment_no).trim().toLowerCase() || student.email.toLowerCase() === String(body.email).trim().toLowerCase())); }

exports.getStudents = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const sortBy = ['full_name', 'enrollment_no', 'admission_date', 'current_semester'].includes(req.query.sortBy) ? req.query.sortBy : 'student_id';
  const direction = String(req.query.order).toUpperCase() === 'ASC' ? 1 : -1; const search = String(req.query.search || '').trim().toLowerCase(); const departmentId = Number(req.query.department_id) || null;
  const data = read(); let rows = data.students.filter((student) => (!search || student.full_name.toLowerCase().includes(search) || student.enrollment_no.toLowerCase().includes(search)) && (!departmentId || student.department_id === departmentId)).map((student) => view(data, student));
  rows.sort((a, b) => String(a[sortBy]).localeCompare(String(b[sortBy]), undefined, { numeric: true }) * direction); const total = rows.length; rows = rows.slice((page - 1) * limit, page * limit);
  res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
exports.getStudent = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Student ID'); const data = read(); const student = data.students.find((entry) => entry.student_id === Number(req.params.id));
  if (!student) return res.status(404).json({ message: 'Student not found.' });
  const results = data.results.filter((result) => result.student_id === student.student_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((result) => { const course = data.courses.find((entry) => entry.course_id === result.course_id); return { ...result, course_code: course?.course_code || '', course_name: course?.course_name || '' }; });
  res.json({ ...view(data, student), results });
});
exports.createStudent = asyncHandler(async (req, res) => {
  validate(req.body); const data = read(); assertRelated(data, req.body); if (duplicate(data, req.body)) throw error('A record with one of these unique values already exists.', 409);
  const id = nextId(data.students, 'student_id'); const timestamp = now(); const student = { student_id: id, ...fromBody(req.body), created_at: timestamp, updated_at: timestamp }; data.students.push(student); write(data);
  res.status(201).json({ message: 'Student added successfully.', data: view(data, student) });
});
exports.updateStudent = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Student ID'); validate(req.body); const data = read(); const student = data.students.find((entry) => entry.student_id === Number(req.params.id));
  if (!student) return res.status(404).json({ message: 'Student not found.' }); assertRelated(data, req.body); if (duplicate(data, req.body, student.student_id)) throw error('A record with one of these unique values already exists.', 409);
  Object.assign(student, fromBody(req.body), { updated_at: now() }); write(data); res.json({ message: 'Student updated successfully.' });
});
exports.deleteStudent = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Student ID'); const id = Number(req.params.id); const data = read(); const index = data.students.findIndex((entry) => entry.student_id === id);
  if (index === -1) return res.status(404).json({ message: 'Student not found.' }); if (data.results.some((result) => result.student_id === id)) throw error('This record is still referenced by another record and cannot be deleted.', 409);
  data.students.splice(index, 1); write(data); res.json({ message: 'Student deleted successfully.' });
});
