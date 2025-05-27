const express = require('express');
const router = express.Router();
const db = require('../db');

// Get summary statistics
router.get('/', async (req, res) => {
    try {
      const [employeeCount] = await new Promise((resolve, reject) => {
        db.query('SELECT COUNT(employeeNumber) AS count FROM employee', (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
  
      const [departmentCount] = await new Promise((resolve, reject) => {
        db.query('SELECT COUNT(departmentCode) AS count FROM department', (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
  
      const [salaryTotal] = await new Promise((resolve, reject) => {
        db.query('SELECT SUM(netSalary) AS total FROM salary', (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
  
      res.json({
        employee: employeeCount.count,
        department: departmentCount.count,
        totalSalary: salaryTotal.total,
      });
  
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// GET /api/stats/department-distribution
router.get('/department-distribution', async (req, res) => {
    try {
      const results = await new Promise((resolve, reject) => {
        db.query(
          `
          SELECT d.departmentName AS department, COUNT(e.departmentCode) AS count
          FROM department d
          LEFT JOIN employee e ON e.departmentCode = d.departmentCode
          GROUP BY d.departmentName
          `,
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });
  
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch department data' });
    }
  });
  
  
  

module.exports = router;
