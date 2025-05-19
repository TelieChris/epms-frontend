// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <ul className="flex space-x-4 justify-center">
        <li>
          <NavLink to="/employees" className="hover:underline" activeclassname="font-bold">
            Employee
          </NavLink>
        </li>
        <li>
          <NavLink to="/departments" className="hover:underline" activeclassname="font-bold">
            Department
          </NavLink>
        </li>
        <li>
          <NavLink to="/salary" className="hover:underline" activeclassname="font-bold">
            Salary
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className="hover:underline" activeclassname="font-bold">
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className="hover:underline text-red-200">
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
