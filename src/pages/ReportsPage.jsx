import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const ReportsPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);
  const filteredSalaries = monthFilter
    ? salaries.filter(s => s.month.toLowerCase().includes(monthFilter.toLowerCase()))
    : salaries;

  const fetchReports = async (month) => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports', {
        params: month ? { month } : {},
      });
      setSalaries(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleMonthFilter = (e) => {
    const selectedMonth = e.target.value; // format: "2025-05"
    setMonthFilter(selectedMonth);
    fetchReports(selectedMonth); // fetch filtered data
  };  

  // Convert '2025-05' to 'May 2025'
  const formatMonth = (month) => {
    const date = new Date(month + '-01');
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalaries.map(s => ({
      Employee: `${s.firstName} ${s.lastName}`,
      Position: s.position,
      Department: s.departmentName,
      Month: s.month,
      'Net Salary (RWF)': s.netSalary,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PayrollReport');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'payroll-report.xlsx');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Monthly Payroll Report</h2>

      <div className="mb-6">
        <input
          type="month"
          className="border p-2 rounded w-full md:w-1/3"
          value={monthFilter}
          onChange={handleMonthFilter}
        />
      </div>

      <div className="overflow-x-auto">
        <div className="mb-6 flex gap-4">
          <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Export Excel
          </button>
      
        </div>
        <table className="min-w-full bg-white shadow-md rounded">
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
            {salaries.length > 0 ? (
              salaries.map((s, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-2">{s.position}</td>
                  <td className="px-4 py-2">{s.departmentName}</td>
                  <td className="px-4 py-2">{formatMonth(s.month)}</td>
                  <td className="px-4 py-2">{s.netSalary.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
