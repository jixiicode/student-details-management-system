# CampusCore Student Management System

A responsive Student Management System for a BTech DBMS project. It uses HTML/CSS/JavaScript on the frontend, Express on Node.js for REST APIs, and MySQL 8 for persistent relational data.

## Features

- Dynamic dashboard: student, department, course, and average-score statistics from MySQL.
- Student CRUD, profile pages, name/enrollment search, sorting, and pagination.
- Department and course CRUD with foreign-key protection against unsafe deletes.
- Result CRUD, student/course search, database validation, and automatic grade calculation.
- Responsive college-administration dashboard with client and server validation.

## Setup

1. Install [Node.js LTS](https://nodejs.org/) and MySQL 8. Start your MySQL server.
2. In MySQL Workbench or a terminal, import the schema and sample records:

   ```bash
   mysql -u root -p < database.sql
   ```

3. Copy `.env.example` to `.env`, then set your real MySQL password and connection details. Do not commit `.env`.
4. Install dependencies and start the app:

   ```bash
   npm install
   npm start
   ```

   During development, use `npm run dev` to restart automatically after changes.

5. Open [http://localhost:3000](http://localhost:3000). Add, edit, search, view, and delete records through the dashboard. The API runs under `/api`, for example `GET /api/students`.

## Database design and viva notes

| Relationship | Implementation |
| --- | --- |
| Department → Students | `students.department_id` references `departments.department_id` |
| Department → Courses | `courses.department_id` references `departments.department_id` |
| Student → Results | `results.student_id` references `students.student_id` |
| Course → Results | `results.course_id` references `courses.course_id` |

All relationships use InnoDB foreign keys with `ON DELETE RESTRICT`, preventing a department, course, or student from being removed while a dependent row exists. The schema also demonstrates primary keys, unique enrollment/email/course code constraints, `CHECK` constraints for marks, credit, and semester ranges, plus indexes for common searches.

The dashboard uses aggregate queries: `COUNT(*)` for totals and `AVG(marks_obtained / maximum_marks * 100)` for the examination average. Student/profile/result screens use `JOIN` queries to combine related names and codes. API queries use `?` placeholders with mysql2 parameter binding, which protects against SQL injection.

## API overview

- `GET /api/dashboard`
- Full CRUD at `/api/students`, `/api/departments`, `/api/courses`, and `/api/results`
- Student list parameters: `search`, `page`, `limit`, `sortBy`, `order`
- Result list parameter: `search`

## Testing checklist

1. Confirm dashboard cards match the imported data.
2. Add a student with a unique enrollment number and email, then search and edit it.
3. Try an existing enrollment or email; the API returns a useful conflict message.
4. Add a result and confirm the grade changes automatically for different mark percentages.
5. Attempt marks greater than the maximum, and delete a referenced department/course; the application rejects both safely.
