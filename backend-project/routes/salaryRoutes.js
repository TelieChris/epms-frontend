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

// Update salary record
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { employeeNumber, grossSalary, totalDeduction, netSalary, month } = req.body;

  const query = `
    UPDATE salary 
    SET employeeNumber = ?, grossSalary = ?, totalDeduction = ?, netSalary = ?, month = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [employeeNumber, grossSalary, totalDeduction, netSalary, month, id],
    (err, result) => {
      if (err) {
        console.error('Error updating salary record:', err);
        return res.status(500).json({ error: 'Failed to update salary record' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Salary record not found' });
      }

      res.json({ message: 'Salary record updated successfully' });
    }
  );
});

// Delete salary record
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM salary WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting salary record:', err);
      return res.status(500).json({ error: 'Failed to delete salary record' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Salary record not found' });
    }

    res.json({ message: 'Salary record deleted successfully' });
  });
});

module.exports = router;
