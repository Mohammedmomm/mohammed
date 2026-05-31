const pool = require('../config/db');

const getCurrent = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM exchange_rate ORDER BY updated_at DESC LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.json({ success: true, data: { usd_to_syp: 13000 } });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM exchange_rate ORDER BY updated_at DESC LIMIT 20'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { usd_to_syp, note } = req.body;
    const updatedBy = req.admin ? req.admin.username : 'system';

    const result = await pool.query(
      'INSERT INTO exchange_rate (usd_to_syp, note, updated_by) VALUES ($1, $2, $3) RETURNING *',
      [usd_to_syp, note || null, updatedBy]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCurrent, getHistory, update };
