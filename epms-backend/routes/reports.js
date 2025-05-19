const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// GET payroll report by month (query param ?month=YYYY-MM)
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'Month query parameter is required' });

  try {
    const query = `
      SELECT e.firstName, e.lastName, e.position, d.departmentName AS department, s.netSalary, s.month
      FROM salary s
      JOIN employee e ON s.employeeNumber = e.employeeNumber
      JOIN department d ON e.departmentCode = d.departmentCode
      WHERE s.month = ?
    `;
    const [rows] = await pool.query(query, [month]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
