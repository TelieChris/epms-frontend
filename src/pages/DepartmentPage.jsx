import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeNumber: '',
    grossSalary: '',
    totalDeduction: '',
    month: '',
  });

  // Fetch salaries and employees
  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/salaries');
      setSalaries(res.data);
    } catch (err) {
      console.error('Failed to fetch salaries', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateNetSalary = () => {
    const { grossSalary, totalDeduction } = form;
    return parseFloat(grossSalary || 0) - parseFloat(totalDeduction || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const netSalary = calculateNetSalary();

    try {
      await axios.post('http://localhost:5000/api/salaries', {
        ...form,
        netSalary
      });
      setForm({
        employeeNumber: '',
        grossSalary: '',
        totalDeduction: '',
        month: ''
      });
      fetchSalaries();
    } catch (err) {
      console.error('Error submitting salary data:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Salary Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 shadow rounded-md mb-8">
        <select
          name="employeeNumber"
          value={form.employeeNumber}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.employeeNumber} value={emp.employeeNumber}>
              {emp.firstName} {emp.lastName} - {emp.employeeNumber}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="grossSalary"
          placeholder="Gross Salary"
          value={form.grossSalary}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="totalDeduction"
          placeholder="Total Deduction"
          value={form.totalDeduction}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="month"
          placeholder="Month (e.g. May 2025)"
          value={form.month}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full">
          Submit Salary
        </button>
      </form>

      {/* Salary Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Month</th>
              <th className="px-4 py-2 text-left">Net Salary (RWF)</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{s.firstName} {s.lastName}</td>
                <td className="px-4 py-2">{s.position}</td>
                <td className="px-4 py-2">{s.departmentName}</td>
                <td className="px-4 py-2">{s.month}</td>
                <td className="px-4 py-2">{s.netSalary.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryPage;
