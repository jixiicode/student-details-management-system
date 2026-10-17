require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { testConnection } = require('./src/config/db');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const resultRoutes = require('./src/routes/resultRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/results', resultRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
testConnection().finally(() => app.listen(port, () => console.log(`Student Management System: http://localhost:${port}`)));
