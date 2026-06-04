const pool = require('../config/db');

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      body_ar VARCHAR(500),
      entity_type VARCHAR(50),
      entity_id INTEGER,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

ensureTable().catch(console.error);

const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const result = await pool.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    const unread = await pool.query('SELECT COUNT(*) FROM notifications WHERE is_read = false');
    res.json({
      success: true,
      data: {
        notifications: result.rows,
        unread_count: parseInt(unread.rows[0].count),
      },
    });
  } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE notifications SET is_read = true WHERE id = $1', [id]);
    res.json({ success: true, data: {} });
  } catch (err) { next(err); }
};

const markAllRead = async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true');
    res.json({ success: true, data: {} });
  } catch (err) { next(err); }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
    res.json({ success: true, data: {} });
  } catch (err) { next(err); }
};

const clearAll = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM notifications');
    res.json({ success: true, data: {} });
  } catch (err) { next(err); }
};

// Helper to create a notification from any controller
const createNotification = async (type, title_ar, body_ar, entity_type = null, entity_id = null) => {
  try {
    await pool.query(
      'INSERT INTO notifications (type, title_ar, body_ar, entity_type, entity_id) VALUES ($1, $2, $3, $4, $5)',
      [type, title_ar, body_ar, entity_type, entity_id]
    );
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

module.exports = { getAll, markRead, markAllRead, deleteNotification, clearAll, createNotification };
