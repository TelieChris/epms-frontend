import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    departmentCode: '',
    departmentName: '',
    grossSalary: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle edit department
  const handleEdit = (department) => {
    setEditMode(true);
    setSelectedDepartment(department);
    setFormData({
      departmentCode: department.departmentCode,
      departmentName: department.departmentName,
      grossSalary: department.grossSalary,
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedDepartment(null);
    setFormData({
      departmentCode: '',
      departmentName: '',
      grossSalary: '',
    });
  };

  // Handle delete department
  const handleDelete = async (departmentCode) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`/api/departments/${departmentCode}`);
        alert('Department deleted successfully!');
        fetchDepartments();
      } catch (error) {
        console.error('Failed to delete department:', error);
        alert('Failed to delete department');
      }
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { departmentCode, departmentName, grossSalary } = formData;

    if (!departmentCode || !departmentName || !grossSalary) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editMode) {
        // Update existing department
        await axios.put(`/api/departments/${selectedDepartment.departmentCode}`, formData);
        alert('Department updated successfully!');
        setEditMode(false);
        setSelectedDepartment(null);
      } else {
        // Create new department
        await axios.post('/api/departments', formData);
        alert('Department added successfully!');
      }
      setFormData({ departmentCode: '', departmentName: '', grossSalary: '' });
      fetchDepartments();
    } catch (error) {
      console.error(editMode ? 'Failed to update department:' : 'Failed to add department:', error);
      alert(editMode ? 'Failed to update department' : 'Failed to add department');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Department Management</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          name="departmentCode"
          placeholder="Department Code"
          value={formData.departmentCode}
          onChange={handleChange}
          className="border p-2 rounded"
          required
          disabled={editMode}
        />
        <input
          type="text"
          name="departmentName"
          placeholder="Department Name"
          value={formData.departmentName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="grossSalary"
          placeholder="Gross Salary"
          value={formData.grossSalary}
          onChange={handleChange}
          className="border p-2 rounded"
          min="0"
          required
        />
        <div className="md:col-span-3 flex gap-2 justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editMode ? 'Update Department' : 'Add Department'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Existing Departments</h2>

      {loading ? (
        <p>Loading departments...</p>
      ) : departments.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Gross Salary</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.departmentCode}>
                <td className="border px-4 py-2">{dept.departmentCode}</td>
                <td className="border px-4 py-2">{dept.departmentName}</td>
                <td className="border px-4 py-2">{dept.grossSalary}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept.departmentCode)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No departments found.</p>
      )}
    </div>
  );
};

export default DepartmentPage;
