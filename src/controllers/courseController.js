const { read, write, nextId, now, error } = require('../config/store');
const { requireFields, positiveInteger } = require('../utils/validation');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fields = ['course_code', 'course_name', 'department_id', 'credits', 'semester'];

function validate(body) {
  requireFields(body, fields); positiveInteger(body.department_id, 'Department ID');
  if (!Number.isInteger(Number(body.credits)) || Number(body.credits) < 1 || Number(body.credits) > 10) throw error('Credits must be between 1 and 10.');
  if (!Number.isInteger(Number(body.semester)) || Number(body.semester) < 1 || Number(body.semester) > 8) throw error('Semester must be between 1 and 8.');
}
function view(data, course) {
  const department = data.departments.find((entry) => entry.department_id === course.department_id);
  return { ...course, department_name: department?.department_name || '', result_count: data.results.filter((result) => result.course_id === course.course_id).length };
}
function requireDepartment(data, id) { if (!data.departments.some((department) => department.department_id === Number(id))) throw error('Department not found.', 400); }
function duplicate(data, code, exceptId) { return data.courses.some((course) => course.course_id !== exceptId && course.course_code.toLowerCase() === String(code).trim().toLowerCase()); }
function fromBody(body) { return { course_code: String(body.course_code).trim(), course_name: String(body.course_name).trim(), department_id: Number(body.department_id), credits: Number(body.credits), semester: Number(body.semester) }; }

exports.getCourses = asyncHandler(async (req, res) => { const data = read(); res.json({ data: data.courses.map((course) => view(data, course)).sort((a, b) => a.course_code.localeCompare(b.course_code)) }); });
exports.getCourse = asyncHandler(async (req, res) => { positiveInteger(req.params.id, 'Course ID'); const data = read(); const course = data.courses.find((entry) => entry.course_id === Number(req.params.id)); if (!course) return res.status(404).json({ message: 'Course not found.' }); res.json(view(data, course)); });
exports.createCourse = asyncHandler(async (req, res) => {
  validate(req.body); const data = read(); requireDepartment(data, req.body.department_id);
  if (duplicate(data, req.body.course_code)) throw error('A record with one of these unique values already exists.', 409);
  const id = nextId(data.courses, 'course_id'); const timestamp = now(); data.courses.push({ course_id: id, ...fromBody(req.body), created_at: timestamp, updated_at: timestamp }); write(data);
  res.status(201).json({ message: 'Course added successfully.', id });
});
exports.updateCourse = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Course ID'); validate(req.body); const data = read(); const course = data.courses.find((entry) => entry.course_id === Number(req.params.id));
  if (!course) return res.status(404).json({ message: 'Course not found.' }); requireDepartment(data, req.body.department_id);
  if (duplicate(data, req.body.course_code, course.course_id)) throw error('A record with one of these unique values already exists.', 409);
  Object.assign(course, fromBody(req.body), { updated_at: now() }); write(data); res.json({ message: 'Course updated successfully.' });
});
exports.deleteCourse = asyncHandler(async (req, res) => {
  positiveInteger(req.params.id, 'Course ID'); const id = Number(req.params.id); const data = read(); const index = data.courses.findIndex((entry) => entry.course_id === id);
  if (index === -1) return res.status(404).json({ message: 'Course not found.' }); if (data.results.some((result) => result.course_id === id)) throw error('This record is still referenced by another record and cannot be deleted.', 409);
  data.courses.splice(index, 1); write(data); res.json({ message: 'Course deleted successfully.' });
});
