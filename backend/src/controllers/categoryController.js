const pool = require('../config/db');
const { generateSlug, ensureUniqueSlug } = require('../utils/slugify');
const { paginate, paginateResponse } = require('../utils/pagination');

const buildTree = (categories, parentId = null) => {
  return categories
    .filter((c) => c.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ ...c, children: buildTree(categories, c.id) }));
};

const getTree = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_available = true) AS product_count
       FROM categories c ORDER BY c.sort_order ASC, c.id ASC`
    );
    const tree = buildTree(result.rows);
    res.json({ success: true, data: tree });
  } catch (err) {
    next(err);
  }
};

const getFlat = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name_ar, name_en, slug, parent_id, sort_order, is_active FROM categories ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catResult = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const category = catResult.rows[0];

    const childrenResult = await pool.query(
      'SELECT * FROM categories WHERE parent_id = $1 ORDER BY sort_order ASC',
      [id]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1 AND is_available = true',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...category,
        children: childrenResult.rows,
        product_count: parseInt(countResult.rows[0].count),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const catResult = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const category = catResult.rows[0];
    const childrenResult = await pool.query(
      'SELECT * FROM categories WHERE parent_id = $1 ORDER BY sort_order ASC',
      [category.id]
    );
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1 AND is_available = true',
      [category.id]
    );
    res.json({
      success: true,
      data: { ...category, children: childrenResult.rows, product_count: parseInt(countResult.rows[0].count) },
    });
  } catch (err) {
    next(err);
  }
};

const getProductsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);

    const catResult = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const category = catResult.rows[0];

    // Collect all descendant category IDs
    const getAllDescendants = async (catId) => {
      const ids = [catId];
      const children = await pool.query('SELECT id FROM categories WHERE parent_id = $1', [catId]);
      for (const child of children.rows) {
        const descendants = await getAllDescendants(child.id);
        ids.push(...descendants);
      }
      return ids;
    };

    const categoryIds = await getAllDescendants(category.id);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products WHERE category_id = ANY($1) AND is_available = true`,
      [categoryIds]
    );

    const productsResult = await pool.query(
      `SELECT p.*,
        c.name_ar AS category_name_ar, c.name_en AS category_name_en,
        b.name AS brand_name, b.name_ar AS brand_name_ar,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.category_id = ANY($1) AND p.is_available = true
       ORDER BY p.is_featured DESC, p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [categoryIds, limit, offset]
    );

    const total = parseInt(countResult.rows[0].count);
    res.json({
      success: true,
      data: paginateResponse(productsResult.rows, total, page, limit),
      category,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name_ar, name_en, parent_id, icon, description_ar, description_en, sort_order } = req.body;
    const baseSlug = generateSlug(name_en || name_ar);
    const slug = await ensureUniqueSlug(baseSlug, 'categories');

    const result = await pool.query(
      `INSERT INTO categories (name_ar, name_en, slug, parent_id, icon, description_ar, description_en, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name_ar, name_en, slug, parent_id || null, icon || null, description_ar || null, description_en || null, sort_order || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name_ar, name_en, parent_id, icon, description_ar, description_en, sort_order, is_active } = req.body;

    const existing = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const result = await pool.query(
      `UPDATE categories SET
        name_ar = COALESCE($1, name_ar),
        name_en = COALESCE($2, name_en),
        parent_id = $3,
        icon = COALESCE($4, icon),
        description_ar = COALESCE($5, description_ar),
        description_en = COALESCE($6, description_en),
        sort_order = COALESCE($7, sort_order),
        is_active = COALESCE($8, is_active)
       WHERE id = $9 RETURNING *`,
      [name_ar, name_en, parent_id !== undefined ? parent_id : existing.rows[0].parent_id,
       icon, description_ar, description_en, sort_order, is_active, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.json({ success: true, data: { message: 'Category deleted' } });
  } catch (err) {
    next(err);
  }
};

const reorder = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, sort_order }]
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query('UPDATE categories SET sort_order = $1 WHERE id = $2', [item.sort_order, item.id]);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ success: true, data: { message: 'Categories reordered' } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTree, getFlat, getById, getBySlug, getProductsBySlug, create, update, deleteCategory, reorder };
