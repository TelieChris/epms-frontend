// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EmployeePage from './pages/EmployeePage';
import DepartmentPage from './pages/DepartmentPage';
import SalaryPage from './pages/SalaryPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/PrivateRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RegisterPage from './pages/RegisterPage';



const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute role="user"><EmployeePage /></ProtectedRoute>} />
          <Route path="/salary" element={<ProtectedRoute role="user"><SalaryPage /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute role="user"><DepartmentPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute role="admin"><ReportsPage /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
