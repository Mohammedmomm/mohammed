const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { config } = require('../config/env');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin.id, username: admin.username },
      },
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};

const me = (req, res) => {
  res.json({ success: true, data: { admin: req.admin } });
};

module.exports = { login, logout, me };
