const pool = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const { position, active } = req.query;
    const conditions = [];
    const params = [];

    if (position) {
      params.push(position);
      conditions.push(`position = $${params.length}`);
    }
    if (active !== undefined && active !== '') {
      params.push(active === 'true');
      conditions.push(`is_active = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT * FROM advertisements ${whereClause} ORDER BY sort_order ASC, created_at DESC`,
      params
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM advertisements WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advertisement not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const {
      title_ar, title_en, description_ar, description_en,
      image_url, link_url, position, is_active, start_date, end_date, sort_order,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO advertisements
        (title_ar, title_en, description_ar, description_en, image_url, link_url, position, is_active, start_date, end_date, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        title_ar || null, title_en || null, description_ar || null, description_en || null,
        image_url, link_url || null, position, is_active !== false,
        start_date || null, end_date || null, sort_order || 0,
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title_ar, title_en, description_ar, description_en,
      image_url, link_url, position, is_active, start_date, end_date, sort_order,
    } = req.body;

    const existing = await pool.query('SELECT id FROM advertisements WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advertisement not found' });
    }

    const result = await pool.query(
      `UPDATE advertisements SET
        title_ar = COALESCE($1, title_ar),
        title_en = COALESCE($2, title_en),
        description_ar = COALESCE($3, description_ar),
        description_en = COALESCE($4, description_en),
        image_url = COALESCE($5, image_url),
        link_url = COALESCE($6, link_url),
        position = COALESCE($7, position),
        is_active = COALESCE($8, is_active),
        start_date = COALESCE($9, start_date),
        end_date = COALESCE($10, end_date),
        sort_order = COALESCE($11, sort_order)
       WHERE id = $12 RETURNING *`,
      [title_ar, title_en, description_ar, description_en, image_url, link_url, position,
       is_active, start_date, end_date, sort_order, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteAd = async (req, res, next) => {
  try {
    const existing = await pool.query('SELECT id FROM advertisements WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advertisement not found' });
    }
    await pool.query('DELETE FROM advertisements WHERE id = $1', [req.params.id]);
    res.json({ success: true, data: { message: 'Advertisement deleted' } });
  } catch (err) {
    next(err);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    const result = await pool.query(
      'UPDATE advertisements SET is_active = NOT is_active WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advertisement not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const trackClick = async (req, res, next) => {
  try {
    const result = await pool.query(
      'UPDATE advertisements SET click_count = click_count + 1 WHERE id = $1 RETURNING id, click_count',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Advertisement not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, deleteAd, toggleActive, trackClick };
