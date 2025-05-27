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
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
      return;
    }

    sessionStorage.removeItem('hasReloaded');

    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats', { withCredentials: true });
        // Ensure we have default values if any stat is null
        setStats({
          employee: res.data.employee || 0,
          department: res.data.department || 0,
          totalSalary: res.data.totalSalary || 0,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
        // Set default values in case of error
        setStats({
          employee: 0,
          department: 0,
          totalSalary: 0,
        });
      }
    };

    const fetchDepartmentDistribution = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats/department-distribution', { withCredentials: true });
        setDepartmentData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch department data', err);
        setDepartmentData([]);
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

  // Format number with commas and handle null/undefined values
  const formatNumber = (number) => {
    return (number || 0).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.username}!</h1>
              <p className="text-gray-600 mt-1">
                Role: <span className="font-medium text-blue-600">{user?.role}</span>
              </p>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Create New User
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Employees</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatNumber(stats.employee)}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Departments</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatNumber(stats.department)}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Salary</p>
                <h3 className="text-2xl font-bold text-gray-800">Frw {formatNumber(stats.totalSalary)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Access Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/employees" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Employees</h3>
                    <p className="text-gray-600 text-sm">Manage employee records</p>
                  </div>
                </div>
              </Link>

              <Link to="/departments" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Departments</h3>
                    <p className="text-gray-600 text-sm">Manage departments</p>
                  </div>
                </div>
              </Link>

              <Link to="/salary" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Salaries</h3>
                    <p className="text-gray-600 text-sm">Manage payroll</p>
                  </div>
                </div>
              </Link>

              <Link to="/reports" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
                    <p className="text-gray-600 text-sm">View analytics</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Department Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Department Distribution</h2>
            <div className="aspect-square">
              {departmentData.length > 0 ? (
                <Pie data={pieData} options={{ maintainAspectRatio: true }} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No department data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <p>Salary processing deadline is 25th of every month</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              <p>HR meeting scheduled for Monday at 10:00 AM</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
              <p>System maintenance on Sunday 12–2 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
