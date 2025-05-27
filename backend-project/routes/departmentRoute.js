const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming your DB connection is exported here

// GET all departments
router.get('/', (req, res) => {
  const query = 'SELECT * FROM department';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      return res.status(500).json({ error: 'Failed to fetch departments' });
    }

    res.json(results);
  });
});

// POST new department
router.post('/', (req, res) => {
  const { departmentCode, departmentName, grossSalary } = req.body;

  const query = 'INSERT INTO department (departmentCode, departmentName, grossSalary) VALUES (?, ?, ?)';
  const values = [departmentCode, departmentName, grossSalary];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting department:', err);
      return res.status(500).json({ error: 'Failed to add department' });
    }

    res.status(201).json({ message: 'Department added successfully' });
  });
});

// DELETE department by code
router.delete('/:code', (req, res) => {
  const departmentCode = req.params.code;

  // First check if there are any employees in this department
  db.query('SELECT COUNT(*) as count FROM employee WHERE departmentCode = ?', [departmentCode], (err, results) => {
    if (err) {
      console.error('Error checking department employees:', err);
      return res.status(500).json({ error: 'Failed to check department employees' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete department with existing employees. Please reassign or delete the employees first.' 
      });
    }

    // If no employees, proceed with deletion
    db.query('DELETE FROM department WHERE departmentCode = ?', [departmentCode], (err, result) => {
      if (err) {
        console.error('Error deleting department:', err);
        return res.status(500).json({ error: 'Failed to delete department' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Department not found' });
      }

      res.json({ message: 'Department deleted successfully' });
    });
  });
});

// PUT update department
router.put('/:code', (req, res) => {
  const departmentCode = req.params.code;
  const { departmentName, grossSalary } = req.body;

  const query = 'UPDATE department SET departmentName = ?, grossSalary = ? WHERE departmentCode = ?';
  const values = [departmentName, grossSalary, departmentCode];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating department:', err);
      return res.status(500).json({ error: 'Failed to update department' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  });
});

module.exports = router;
