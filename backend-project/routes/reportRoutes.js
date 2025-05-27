const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/reports?month=2025-05
router.get('/', (req, res) => {
  const { month } = req.query;

  let query = `
    SELECT 
      e.firstName, 
      e.lastName, 
      e.position, 
      d.departmentName, 
      s.netSalary, 
      s.month
    FROM salary s
    JOIN employee e ON s.employeeNumber = e.employeeNumber
    JOIN department d ON e.departmentCode = d.departmentCode
  `;

  if (month) {
    query += ` WHERE s.month = ?`;
  }

  query += ` ORDER BY s.month DESC`;

  db.query(query, month ? [month] : [], (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

module.exports = router;
