import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    employee: 0,
    department: 0,
    totalSalary: 0,
  });

  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    // Prevent infinite reload loop using sessionStorage
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload(); // Force full browser reload
      return; // Stop executing below
    }

    // Clear flag so it can reload again on next navigation
    sessionStorage.removeItem('hasReloaded');

    // Now fetch data
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats', { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    const fetchDepartmentDistribution = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats/department-distribution', { withCredentials: true });
        setDepartmentData(res.data);
      } catch (err) {
        console.error('Failed to fetch department data', err);
      }
    };

    fetchStats();
    fetchDepartmentDistribution();
  }, []);

  const pieData = {
    labels: departmentData.map(item => item.department),
    datasets: [
      {
        label: '# of Employees',
        data: departmentData.map(item => item.count),
        backgroundColor: ['#60a5fa', '#34d399', '#facc15', '#f472b6', '#a78bfa', '#fb923c'],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}!</h1>
      <p className="text-gray-700 mb-6">Role: <span className="font-semibold">{user?.role}</span></p>
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex justify-between items-center">
      {user?.role === 'admin' && <Link
            to="/register"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Create New User
          </Link>}
        </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Employees</h2>
          <p className="text-2xl">{stats.employee}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Departments</h2>
          <p className="text-2xl">{stats.department}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Salary</h2>
          <p className="text-2xl">Frw {stats.totalSalary}</p>
        </div>
      </div>

      {/* Charts */}
      {/* <div className="max-w-xs mx-auto m-4">
        <h2 className="text-xl font-bold mb-4">Employees by Department</h2>
        <Pie data={pieData} width={50} height={50} />
      </div> */}

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/employees" className="bg-white border rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Manage Employees</h2>
          <p className="text-gray-600">View and manage employee records.</p>
        </Link>
        <Link to="/departments" className="bg-white border rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Manage Departments</h2>
          <p className="text-gray-600">Organize departments and teams.</p>
        </Link>
        <Link to="/salary" className="bg-white border rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Manage Salaries</h2>
          <p className="text-gray-600">Set and adjust employee salaries.</p>
        </Link>
        <Link to="/reports" className="bg-white border rounded-lg shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">View Reports</h2>
          <p className="text-gray-600">Access salary and performance reports.</p>
        </Link>
      </div>

      {/* Announcements */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">📢 Announcements</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Salary processing deadline is 25th of every month.</li>
          <li>HR meeting scheduled for Monday at 10:00 AM.</li>
          <li>System maintenance on Sunday 12–2 AM.</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
