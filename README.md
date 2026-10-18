# CampusCore Student Management System

A responsive Student Management System using HTML/CSS/JavaScript on the frontend and Express on Node.js for REST APIs. It stores its data in a local JSON file, so no database server or Docker setup is required.

## Features

- Dynamic dashboard: student, department, course, and average-score statistics from the local JSON datastore.
- Student CRUD, profile pages, name/enrollment search, sorting, and pagination.
- Department and course CRUD with foreign-key protection against unsafe deletes.
- Result CRUD, student/course search, database validation, and automatic grade calculation.
- Responsive college-administration dashboard with client and server validation.

## Setup

1. Install [Node.js LTS](https://nodejs.org/).
2. Install dependencies and start the app:

   ```bash
   npm install
   npm start
   ```

   During development, use `npm run dev` to restart automatically after changes.

3. Open [http://localhost:3000](http://localhost:3000). Add, edit, search, view, and delete records through the dashboard. The API runs under `/api`, for example `GET /api/students`.

On the first start, the app creates `data/student-management.json` with sample departments, courses, students, and results. Later changes persist in that file. Delete it only when you intentionally want the sample data created again.

## Run without configuring local MySQL

With Docker Desktop installed and running, this command starts the website and persists its JSON data in a Docker volume:

```bash
docker compose up --build -d
```

Check the running service with `docker compose ps`. To stop it, use `docker compose down`. The JSON data is retained in the `json_data` Docker volume; use `docker compose down -v` only when you intentionally want to delete the container data and recreate the sample data.

## Legacy MySQL schema

| Relationship | Implementation |
| --- | --- |
| Department → Students | `students.department_id` references `departments.department_id` |
| Department → Courses | `courses.department_id` references `departments.department_id` |
| Student → Results | `results.student_id` references `students.student_id` |
| Course → Results | `results.course_id` references `courses.course_id` |

The original MySQL schema remains in `database.sql` for project documentation. The JSON runtime enforces the same unique enrollment/email/course-code checks and prevents deletion when related records exist.

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
