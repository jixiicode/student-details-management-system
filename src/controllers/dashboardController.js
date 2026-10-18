const { read } = require('../config/store');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.getDashboard = asyncHandler(async (req, res) => {
  const data = read();
  const averageScore = data.results.length
    ? Number((data.results.reduce((sum, result) => sum + ((Number(result.marks_obtained) / Number(result.maximum_marks)) * 100), 0) / data.results.length).toFixed(2))
    : 0;
  const recentStudents = [...data.students]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((student) => {
      const department = data.departments.find((entry) => entry.department_id === student.department_id);
      return { ...student, department_name: department?.department_name || '' };
    });
  res.json({ totals: { students: data.students.length, departments: data.departments.length, courses: data.courses.length, averageScore }, recentStudents });
});
