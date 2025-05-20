import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = () => {
    axios
      .get('/api/departments')
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error('Failed to load departments', err));
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    address: '',
    telephone: '',
    gender: 'Male',
    hiredDate: '',
    departmentCode: '',
  });

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    axios
      .get('/api/employees')
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/employees', formData)
      .then((res) => {
        alert('Employee added successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          position: '',
          address: '',
          telephone: '',
          gender: 'Male',
          hiredDate: '',
          departmentCode: '',
        });
        fetchEmployees();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add employee');
      });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="date"
          name="hiredDate"
          value={formData.hiredDate}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
        <select
          name="departmentCode"
          value={formData.departmentCode}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.departmentCode} value={dept.departmentCode}>
              {dept.departmentName} ({dept.departmentCode})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 col-span-full md:col-auto hover:bg-blue-700"
        >
          Add Employee
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Employees List</h2>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Employee Number</th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Position</th>
              <th className="border border-gray-300 px-4 py-2">Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeNumber}>
                <td className="border border-gray-300 px-4 py-2">{emp.employeeNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.firstName}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.position}</td>
                <td className="border border-gray-300 px-4 py-2">{emp.departmentCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeePage;
