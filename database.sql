CREATE DATABASE IF NOT EXISTS student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_management;

CREATE TABLE departments (
  department_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  department_code VARCHAR(12) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_department_name UNIQUE (department_name),
  CONSTRAINT uq_department_code UNIQUE (department_code)
) ENGINE=InnoDB;

CREATE TABLE students (
  student_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enrollment_no VARCHAR(30) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('Male','Female','Other') NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  admission_date DATE NOT NULL,
  current_semester TINYINT UNSIGNED NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_student_enrollment UNIQUE (enrollment_no),
  CONSTRAINT uq_student_email UNIQUE (email),
  CONSTRAINT chk_student_semester CHECK (current_semester BETWEEN 1 AND 8),
  CONSTRAINT fk_student_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_student_name (full_name),
  INDEX idx_student_department (department_id)
) ENGINE=InnoDB;

CREATE TABLE courses (
  course_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL,
  course_name VARCHAR(150) NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  credits TINYINT UNSIGNED NOT NULL,
  semester TINYINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_course_code UNIQUE (course_code),
  CONSTRAINT chk_course_credits CHECK (credits BETWEEN 1 AND 10),
  CONSTRAINT chk_course_semester CHECK (semester BETWEEN 1 AND 8),
  CONSTRAINT fk_course_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_course_department (department_id)
) ENGINE=InnoDB;

CREATE TABLE results (
  result_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  examination_type VARCHAR(60) NOT NULL,
  marks_obtained DECIMAL(6,2) NOT NULL,
  maximum_marks DECIMAL(6,2) NOT NULL,
  grade VARCHAR(3) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_result_marks CHECK (marks_obtained >= 0 AND maximum_marks > 0 AND marks_obtained <= maximum_marks),
  CONSTRAINT chk_result_grade CHECK (grade IN ('A+','A','B+','B','C','D','F')),
  CONSTRAINT fk_result_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_result_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_result_student (student_id),
  INDEX idx_result_course (course_id)
) ENGINE=InnoDB;

INSERT INTO departments (department_name, department_code) VALUES
('Computer Science and Engineering', 'CSE'), ('Information Technology', 'IT'), ('Electronics and Communication', 'ECE'),
('Mechanical Engineering', 'ME'), ('Civil Engineering', 'CE');

INSERT INTO courses (course_code, course_name, department_id, credits, semester) VALUES
('CS301', 'Database Management Systems', 1, 4, 5), ('CS302', 'Operating Systems', 1, 4, 5),
('CS401', 'Computer Networks', 1, 3, 6), ('CS402', 'Software Engineering', 1, 3, 6),
('IT301', 'Web Technologies', 2, 3, 5), ('IT302', 'Cloud Computing', 2, 3, 6),
('EC301', 'Digital Signal Processing', 3, 4, 5), ('ME301', 'Thermodynamics', 4, 4, 5),
('CE301', 'Structural Analysis', 5, 4, 5);

INSERT INTO students (enrollment_no, full_name, email, phone, date_of_birth, gender, department_id, admission_date, current_semester, address) VALUES
('2023CSE001', 'Aarav Sharma', 'aarav.sharma@example.com', '9876543210', '2005-03-14', 'Male', 1, '2023-08-01', 5, 'New Delhi, India'),
('2023CSE002', 'Ananya Verma', 'ananya.verma@example.com', '9876543211', '2005-07-22', 'Female', 1, '2023-08-01', 5, 'Lucknow, India'),
('2023IT001', 'Rohan Gupta', 'rohan.gupta@example.com', '9876543212', '2004-11-05', 'Male', 2, '2023-08-01', 5, 'Jaipur, India'),
('2023ECE001', 'Priya Nair', 'priya.nair@example.com', '9876543213', '2005-01-19', 'Female', 3, '2023-08-01', 5, 'Kochi, India'),
('2023CSE003', 'Kabir Singh', 'kabir.singh@example.com', '9876543214', '2005-09-08', 'Male', 1, '2023-08-01', 5, 'Chandigarh, India'),
('2023CSE004', 'Meera Iyer', 'meera.iyer@example.com', '9876543215', '2005-05-16', 'Female', 1, '2023-08-01', 5, 'Bengaluru, India'),
('2023IT002', 'Ishaan Patel', 'ishaan.patel@example.com', '9876543216', '2005-12-03', 'Male', 2, '2023-08-01', 5, 'Ahmedabad, India'),
('2023IT003', 'Sneha Kulkarni', 'sneha.kulkarni@example.com', '9876543217', '2005-02-27', 'Female', 2, '2023-08-01', 5, 'Pune, India'),
('2023ECE002', 'Vikram Rao', 'vikram.rao@example.com', '9876543218', '2005-06-11', 'Male', 3, '2023-08-01', 5, 'Hyderabad, India'),
('2023ME001', 'Aditya Joshi', 'aditya.joshi@example.com', '9876543219', '2005-04-30', 'Male', 4, '2023-08-01', 5, 'Nagpur, India'),
('2023CE001', 'Kavya Reddy', 'kavya.reddy@example.com', '9876543220', '2005-08-25', 'Female', 5, '2023-08-01', 5, 'Visakhapatnam, India'),
('2024CSE001', 'Arjun Malhotra', 'arjun.malhotra@example.com', '9876543221', '2006-01-13', 'Male', 1, '2024-08-01', 3, 'Gurugram, India'),
('2024IT001', 'Diya Kapoor', 'diya.kapoor@example.com', '9876543222', '2006-10-09', 'Female', 2, '2024-08-01', 3, 'Noida, India'),
('2024ECE001', 'Nikhil Das', 'nikhil.das@example.com', '9876543223', '2006-07-18', 'Other', 3, '2024-08-01', 3, 'Kolkata, India');

INSERT INTO results (student_id, course_id, examination_type, marks_obtained, maximum_marks, grade) VALUES
(1, 1, 'Mid Semester', 86, 100, 'A'), (1, 2, 'Mid Semester', 78, 100, 'B+'),
(2, 1, 'Mid Semester', 92, 100, 'A+'), (2, 2, 'Mid Semester', 87, 100, 'A'),
(3, 5, 'Mid Semester', 73, 100, 'B+'), (3, 6, 'Quiz', 36, 50, 'B+'),
(4, 7, 'Mid Semester', 81, 100, 'A'), (5, 1, 'Mid Semester', 68, 100, 'B'),
(5, 3, 'Quiz', 42, 50, 'A'), (6, 2, 'Mid Semester', 94, 100, 'A+'),
(6, 4, 'Mid Semester', 76, 100, 'B+'), (7, 5, 'Mid Semester', 64, 100, 'B'),
(8, 6, 'Mid Semester', 88, 100, 'A'), (9, 7, 'Mid Semester', 55, 100, 'C'),
(10, 8, 'Mid Semester', 79, 100, 'B+'), (11, 9, 'Mid Semester', 83, 100, 'A');
