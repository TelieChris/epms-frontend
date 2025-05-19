// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const connection = require('./db');

const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoute');
const salaryRoutes = require('./routes/salaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

require('dotenv').config();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/reports', reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
