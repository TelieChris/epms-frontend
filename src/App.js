// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeePage from './pages/EmployeePage';
import DepartmentPage from './pages/DepartmentPage';
import SalaryPage from './pages/SalaryPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/departments" element={<DepartmentPage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
