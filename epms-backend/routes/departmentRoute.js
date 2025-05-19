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

module.exports = router;
