const pool = require('../config/db');

const PUBLIC_KEYS = [
  'site_name_ar', 'site_name_en', 'whatsapp_number', 'phone_number',
  'address_ar', 'address_en', 'logo_url', 'facebook_url', 'instagram_url',
  'telegram_url', 'products_per_page', 'similar_products_count',
];

const getPublic = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT key, value, type FROM site_settings WHERE key = ANY($1)',
      [PUBLIC_KEYS]
    );
    const settings = {};
    for (const row of result.rows) {
      settings[row.key] = row.type === 'number' ? parseFloat(row.value) : row.value;
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings ORDER BY key ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { settings } = req.body; // { key: value, ... } or [{ key, value }]

    const entries = Array.isArray(settings)
      ? settings
      : Object.entries(settings).map(([key, value]) => ({ key, value }));

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const entry of entries) {
        await client.query(
          `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW())
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [entry.key, entry.value]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.json({ success: true, data: { message: `Updated ${entries.length} settings` } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPublic, getAdmin, update };
