const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(__dirname, '../../data');
const dataFile = path.join(dataDirectory, 'student-management.json');

const stamp = (index) => new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString();
const record = (values, index) => ({ ...values, created_at: stamp(index), updated_at: stamp(index) });

function seedData() {
  const departments = [
    ['Computer Science and Engineering', 'CSE'], ['Information Technology', 'IT'], ['Electronics and Communication', 'ECE'],
    ['Mechanical Engineering', 'ME'], ['Civil Engineering', 'CE']
  ].map(([department_name, department_code], index) => record({ department_id: index + 1, department_name, department_code }, index));

  const courses = [
    ['CS301', 'Database Management Systems', 1, 4, 5], ['CS302', 'Operating Systems', 1, 4, 5], ['CS401', 'Computer Networks', 1, 3, 6],
    ['CS402', 'Software Engineering', 1, 3, 6], ['IT301', 'Web Technologies', 2, 3, 5], ['IT302', 'Cloud Computing', 2, 3, 6],
    ['EC301', 'Digital Signal Processing', 3, 4, 5], ['ME301', 'Thermodynamics', 4, 4, 5], ['CE301', 'Structural Analysis', 5, 4, 5]
  ].map(([course_code, course_name, department_id, credits, semester], index) => record({ course_id: index + 1, course_code, course_name, department_id, credits, semester }, index));

  const students = [
    ['2023CSE001', 'Aarav Sharma', 'aarav.sharma@example.com', '9876543210', '2005-03-14', 'Male', 1, '2023-08-01', 5, 'New Delhi, India'],
    ['2023CSE002', 'Ananya Verma', 'ananya.verma@example.com', '9876543211', '2005-07-22', 'Female', 1, '2023-08-01', 5, 'Lucknow, India'],
    ['2023IT001', 'Rohan Gupta', 'rohan.gupta@example.com', '9876543212', '2004-11-05', 'Male', 2, '2023-08-01', 5, 'Jaipur, India'],
    ['2023ECE001', 'Priya Nair', 'priya.nair@example.com', '9876543213', '2005-01-19', 'Female', 3, '2023-08-01', 5, 'Kochi, India'],
    ['2023CSE003', 'Kabir Singh', 'kabir.singh@example.com', '9876543214', '2005-09-08', 'Male', 1, '2023-08-01', 5, 'Chandigarh, India'],
    ['2023CSE004', 'Meera Iyer', 'meera.iyer@example.com', '9876543215', '2005-05-16', 'Female', 1, '2023-08-01', 5, 'Bengaluru, India'],
    ['2023IT002', 'Ishaan Patel', 'ishaan.patel@example.com', '9876543216', '2005-12-03', 'Male', 2, '2023-08-01', 5, 'Ahmedabad, India'],
    ['2023IT003', 'Sneha Kulkarni', 'sneha.kulkarni@example.com', '9876543217', '2005-02-27', 'Female', 2, '2023-08-01', 5, 'Pune, India'],
    ['2023ECE002', 'Vikram Rao', 'vikram.rao@example.com', '9876543218', '2005-06-11', 'Male', 3, '2023-08-01', 5, 'Hyderabad, India'],
    ['2023ME001', 'Aditya Joshi', 'aditya.joshi@example.com', '9876543219', '2005-04-30', 'Male', 4, '2023-08-01', 5, 'Nagpur, India'],
    ['2023CE001', 'Kavya Reddy', 'kavya.reddy@example.com', '9876543220', '2005-08-25', 'Female', 5, '2023-08-01', 5, 'Visakhapatnam, India'],
    ['2024CSE001', 'Arjun Malhotra', 'arjun.malhotra@example.com', '9876543221', '2006-01-13', 'Male', 1, '2024-08-01', 3, 'Gurugram, India'],
    ['2024IT001', 'Diya Kapoor', 'diya.kapoor@example.com', '9876543222', '2006-10-09', 'Female', 2, '2024-08-01', 3, 'Noida, India'],
    ['2024ECE001', 'Nikhil Das', 'nikhil.das@example.com', '9876543223', '2006-07-18', 'Other', 3, '2024-08-01', 3, 'Kolkata, India']
  ].map(([enrollment_no, full_name, email, phone, date_of_birth, gender, department_id, admission_date, current_semester, address], index) => record({ student_id: index + 1, enrollment_no, full_name, email, phone, date_of_birth, gender, department_id, admission_date, current_semester, address }, index));

  const results = [
    [1, 1, 'Mid Semester', 86, 100, 'A'], [1, 2, 'Mid Semester', 78, 100, 'B+'], [2, 1, 'Mid Semester', 92, 100, 'A+'], [2, 2, 'Mid Semester', 87, 100, 'A'],
    [3, 5, 'Mid Semester', 73, 100, 'B+'], [3, 6, 'Quiz', 36, 50, 'B+'], [4, 7, 'Mid Semester', 81, 100, 'A'], [5, 1, 'Mid Semester', 68, 100, 'B'],
    [5, 3, 'Quiz', 42, 50, 'A'], [6, 2, 'Mid Semester', 94, 100, 'A+'], [6, 4, 'Mid Semester', 76, 100, 'B+'], [7, 5, 'Mid Semester', 64, 100, 'B'],
    [8, 6, 'Mid Semester', 88, 100, 'A'], [9, 7, 'Mid Semester', 55, 100, 'C'], [10, 8, 'Mid Semester', 79, 100, 'B+'], [11, 9, 'Mid Semester', 83, 100, 'A']
  ].map(([student_id, course_id, examination_type, marks_obtained, maximum_marks, grade], index) => record({ result_id: index + 1, student_id, course_id, examination_type, marks_obtained, maximum_marks, grade }, index));

  return { departments, courses, students, results };
}

function initialize() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, `${JSON.stringify(seedData(), null, 2)}\n`);
}

function read() {
  initialize();
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function write(data) {
  initialize();
  fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`);
}

function nextId(rows, field) { return rows.reduce((highest, row) => Math.max(highest, Number(row[field]) || 0), 0) + 1; }
function now() { return new Date().toISOString(); }
function error(message, status = 400) { const issue = new Error(message); issue.status = status; return issue; }

module.exports = { initialize, read, write, nextId, now, error, dataFile };
