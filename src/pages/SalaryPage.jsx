import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const SalaryPage = () => {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    employeeNumber: '',
    departmentCode: '',
    totalDeduction: '',
    month: '',
  });

  const [grossSalary, setGrossSalary] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

  // Fetch employees and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, salRes] = await Promise.all([
          axios.get('/api/employees'),
          axios.get('/api/departments'),
          axios.get('/api/salaries'),
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setSalaryRecords(salRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'departmentCode') {
      const dept = departments.find(d => d.departmentCode === value);
      setGrossSalary(dept ? parseFloat(dept.grossSalary) : 0);
    }

    if (name === 'totalDeduction') {
      const deduction = parseFloat(value) || 0;
      setNetSalary(grossSalary - deduction);
    }
  };

  // Submit salary
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      employeeNumber: formData.employeeNumber,
      departmentCode: formData.departmentCode,
      grossSalary,
      totalDeduction: parseFloat(formData.totalDeduction),
      netSalary,
      month: formData.month,
    };

    try {
      await axios.post('/api/salaries', payload);
      alert('Salary recorded successfully');
      setFormData({
        employeeNumber: '',
        departmentCode: '',
        totalDeduction: '',
        month: '',
      });
      setGrossSalary(0);
      setNetSalary(0);
      const res = await axios.get('/api/salaries');
      setSalaryRecords(res.data);
    } catch (error) {
      console.error('Failed to save salary:', error);
      alert('Error saving salary');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Salary Management</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 mb-8">
        <select
          name="employeeNumber"
          value={formData.employeeNumber}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.employeeNumber} value={emp.employeeNumber}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>

        <select
          name="departmentCode"
          value={formData.departmentCode}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.departmentCode} value={dept.departmentCode}>
              {dept.departmentName}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="totalDeduction"
          value={formData.totalDeduction}
          onChange={handleChange}
          placeholder="Total Deduction"
          className="border p-2 rounded"
          min="0"
          required
        />

      <input
        type="month"
        name="month"
        value={formData.month}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

        <div className="md:col-span-3 flex justify-between items-center">
          <p className="text-sm">Gross Salary: <strong>{grossSalary}</strong></p>
          <p className="text-sm">Net Salary: <strong>{netSalary}</strong></p>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Salary
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Recorded Salaries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Gross Salary</th>
              <th className="border px-4 py-2">Deduction</th>
              <th className="border px-4 py-2">Net Salary</th>
              <th className="border px-4 py-2">Month</th>
            </tr>
          </thead>
          <tbody>
            {salaryRecords.map((rec, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{rec.firstName} {rec.lastName}</td>
                <td className="border px-4 py-2">{rec.departmentName}</td>
                <td className="border px-4 py-2">{rec.grossSalary}</td>
                <td className="border px-4 py-2">{rec.totalDeduction}</td>
                <td className="border px-4 py-2">{rec.netSalary}</td>
                <td className="border px-4 py-2">{rec.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryPage;
