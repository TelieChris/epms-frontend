import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports');
      setSalaries(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const handleMonthFilter = (e) => {
    setMonthFilter(e.target.value);
  };

  // Convert '2025-05' to 'May 2025'
  const formatMonth = (dateStr) => {
    const date = new Date(dateStr + '-01');
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const filteredSalaries = monthFilter
    ? salaries.filter(s => {
        const formatted = formatMonth(monthFilter);
        return s.month.toLowerCase().includes(formatted.toLowerCase());
      })
    : salaries;

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
            {filteredSalaries.map((s, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
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

export default ReportsPage;
