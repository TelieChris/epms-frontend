// backend/initAdmin.js
const bcrypt = require('bcryptjs');
const db = require('./db');

const initAdmin = async () => {
  db.query('SELECT COUNT(*) as count FROM users', async (err, results) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }

    const userCount = results[0].count;

    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Error creating initial admin:', err);
          } else {
            console.log('Initial admin user created: username = admin, password = admin123');
          }
        }
      );
    }
  });
};

module.exports = initAdmin;
