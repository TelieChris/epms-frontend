import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check-session', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between">
      <div className="space-x-4">
      {user ? (
          <>
            <Link to="/">Home</Link>
          </>
        ) : (
          <Link to="/login"></Link>
        )}
       
      {user?.role === 'admin' && <Link to="/employees">Employees</Link>}
      {user?.role === 'user' &&  <Link to="/salary">Salaries</Link>}
      {user?.role === 'admin' && <Link to="/departments">Departments</Link>}
      <Link to="/reports">Reports</Link>
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-4">{user.username} ({user.role})</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
