import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  // Handle edit employee
  const handleEdit = (employee) => {
    setEditMode(true);
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      address: employee.address,
      telephone: employee.telephone,
      gender: employee.gender,
      hiredDate: employee.hiredDate,
      departmentCode: employee.departmentCode,
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedEmployee(null);
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
  };

  // Handle delete employee
  const handleDelete = (employeeNumber) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios
        .delete(`/api/employees/${employeeNumber}`)
        .then(() => {
          alert('Employee deleted successfully!');
          fetchEmployees();
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to delete employee');
        });
    }
  };

  // Handle form submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Update existing employee
      axios
        .put(`/api/employees/${selectedEmployee.employeeNumber}`, formData)
        .then(() => {
          alert('Employee updated successfully!');
          setEditMode(false);
          setSelectedEmployee(null);
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
          alert('Failed to update employee');
        });
    } else {
      // Create new employee
      axios
        .post('/api/employees', formData)
        .then(() => {
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
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        {editMode ? 'Edit Employee' : 'Add New Employee'}
      </h2>

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

        <div className="col-span-full md:col-auto flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            {editMode ? 'Update Employee' : 'Add Employee'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
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
              <th className="border border-gray-300 px-4 py-2">Actions</th>
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
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.employeeNumber)}
                      className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeePage;
