const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE: Add a new employee
router.post('/', (req, res) => {
  const {
    firstName,
    lastName,
    position,
    address,
    telephone,
    gender,
    hiredDate,
    departmentCode,
  } = req.body;

  const sql = `
    INSERT INTO employee 
    (firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode],
    (err, result) => {
      if (err) {
        console.error('Error inserting employee:', err);
        res.status(500).json({ error: 'Failed to add employee' });
      } else {
        res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
      }
    }
  );
});

// READ: Get all employees
router.get('/', (req, res) => {
  db.query('SELECT * FROM employee', (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Failed to fetch employees' });
    } else {
      res.json(results);
    }
  });
});

// UPDATE: Update employee by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const {
    firstName,
    lastName,
    position,
    address,
    telephone,
    gender,
    hiredDate,
    departmentCode,
  } = req.body;

  const sql = `
    UPDATE employee SET 
    firstName = ?, lastName = ?, position = ?, address = ?, 
    telephone = ?, gender = ?, hiredDate = ?, departmentCode = ?
    WHERE employeeNumber = ?
  `;

  db.query(
    sql,
    [firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode, id],
    (err, result) => {
      if (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Failed to update employee' });
      } else {
        res.json({ message: 'Employee updated successfully' });
      }
    }
  );
});

// DELETE: Delete employee by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM employee WHERE employeeNumber = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Failed to delete employee' });
    } else {
      res.json({ message: 'Employee deleted successfully' });
    }
  });
});

module.exports = router;
