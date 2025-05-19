const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new salary record
router.post('/', (req, res) => {
  const { employeeNumber, grossSalary, totalDeduction, netSalary, month } = req.body;

  if (!employeeNumber || !grossSalary || !totalDeduction || !netSalary || !month) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
    INSERT INTO salary (employeeNumber, grossSalary, totalDeduction, netSalary, month)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [employeeNumber, grossSalary, totalDeduction, netSalary, month], (err, result) => {
    if (err) {
      console.error('Error inserting salary:', err);
      return res.status(500).json({ error: 'Database error while inserting salary' });
    }
    res.status(201).json({ message: 'Salary recorded successfully' });
  });
});

// Get all salary records with employee and department details
router.get('/', (req, res) => {
  const query = `
    SELECT 
      s.id, s.employeeNumber, s.grossSalary, s.totalDeduction, s.netSalary, s.month,
      e.firstName, e.lastName, e.position, e.departmentCode,
      d.departmentName
    FROM salary s
    JOIN employee e ON s.employeeNumber = e.employeeNumber
    JOIN department d ON e.departmentCode = d.departmentCode
    ORDER BY s.month DESC, e.lastName
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching salary records:', err);
      return res.status(500).json({ error: 'Database error while fetching salaries' });
    }
    res.json(results);
  });
});

module.exports = router;
