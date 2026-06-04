const pool = require('../config/db');
const { generateSlug, ensureUniqueSlug } = require('../utils/slugify');
const { paginate, paginateResponse } = require('../utils/pagination');
const { createNotification } = require('./notificationController');

const getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const search = req.query.search || '';

    let where = '';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      where = `WHERE b.name ILIKE $${params.length} OR b.name_ar ILIKE $${params.length}`;
    }

    const countResult = await pool.query(`SELECT COUNT(*) FROM brands b ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const result = await pool.query(
      `SELECT b.*,
        (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id AND p.is_available = true) AS product_count
       FROM brands b ${where}
       ORDER BY b.sort_order ASC, b.name ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ success: true, data: paginateResponse(result.rows, total, page, limit) });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT b.*,
        (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id AND p.is_available = true) AS product_count
       FROM brands b WHERE b.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, name_ar, logo_url, description_ar, description_en, sort_order } = req.body;
    const baseSlug = generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug, 'brands');

    const result = await pool.query(
      `INSERT INTO brands (name, name_ar, slug, logo_url, description_ar, description_en, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, name_ar || null, slug, logo_url || null, description_ar || null, description_en || null, sort_order || 0]
    );
    const brand = result.rows[0];
    await createNotification('brand_created', 'ماركة جديدة', `تم إضافة ماركة "${brand.name_ar || brand.name}"`, 'brand', brand.id);
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, name_ar, logo_url, description_ar, description_en, sort_order, is_active } = req.body;

    const existing = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const result = await pool.query(
      `UPDATE brands SET
        name = COALESCE($1, name),
        name_ar = COALESCE($2, name_ar),
        logo_url = COALESCE($3, logo_url),
        description_ar = COALESCE($4, description_ar),
        description_en = COALESCE($5, description_en),
        sort_order = COALESCE($6, sort_order),
        is_active = COALESCE($7, is_active)
       WHERE id = $8 RETURNING *`,
      [name, name_ar, logo_url, description_ar, description_en, sort_order, is_active, id]
    );
    const brand = result.rows[0];
    await createNotification('brand_updated', 'تحديث ماركة', `تم تعديل ماركة "${brand.name_ar || brand.name}"`, 'brand', brand.id);
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    await pool.query('DELETE FROM brands WHERE id = $1', [id]);
    await createNotification('brand_deleted', 'حذف ماركة', `تم حذف الماركة #${id}`, 'brand', id);
    res.json({ success: true, data: { message: 'Brand deleted' } });
  } catch (err) {
    next(err);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE brands SET is_active = NOT is_active WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, deleteBrand, toggleActive };
