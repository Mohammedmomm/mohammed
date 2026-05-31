const pool = require('../config/db');

const getTemplateByCategory = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM specification_templates WHERE category_id = $1 ORDER BY sort_order ASC',
      [req.params.categoryId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const createTemplate = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { field_key, label_ar, label_en, field_type, unit, options, is_required, is_filterable, sort_order } = req.body;

    const result = await pool.query(
      `INSERT INTO specification_templates
        (category_id, field_key, label_ar, label_en, field_type, unit, options, is_required, is_filterable, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [categoryId, field_key, label_ar, label_en, field_type, unit || null, options ? JSON.stringify(options) : null,
       is_required || false, is_filterable || false, sort_order || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { field_key, label_ar, label_en, field_type, unit, options, is_required, is_filterable, sort_order } = req.body;

    const existing = await pool.query('SELECT * FROM specification_templates WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    const result = await pool.query(
      `UPDATE specification_templates SET
        field_key = COALESCE($1, field_key),
        label_ar = COALESCE($2, label_ar),
        label_en = COALESCE($3, label_en),
        field_type = COALESCE($4, field_type),
        unit = COALESCE($5, unit),
        options = COALESCE($6, options),
        is_required = COALESCE($7, is_required),
        is_filterable = COALESCE($8, is_filterable),
        sort_order = COALESCE($9, sort_order)
       WHERE id = $10 RETURNING *`,
      [field_key, label_ar, label_en, field_type, unit, options ? JSON.stringify(options) : null,
       is_required, is_filterable, sort_order, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT id FROM specification_templates WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    await pool.query('DELETE FROM specification_templates WHERE id = $1', [id]);
    res.json({ success: true, data: { message: 'Template deleted' } });
  } catch (err) {
    next(err);
  }
};

const reorderTemplates = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, sort_order }]
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE specification_templates SET sort_order = $1 WHERE id = $2',
          [item.sort_order, item.id]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ success: true, data: { message: 'Templates reordered' } });
  } catch (err) {
    next(err);
  }
};

const getProductSpecs = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT ps.*, st.label_ar, st.label_en, st.field_type, st.unit AS template_unit
       FROM product_specifications ps
       LEFT JOIN specification_templates st ON ps.field_key = st.field_key
       WHERE ps.product_id = $1
       ORDER BY st.sort_order ASC NULLS LAST`,
      [req.params.productId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const setProductSpecs = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { specs } = req.body; // [{ field_key, value_ar, value_en, value_numeric, unit }]

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM product_specifications WHERE product_id = $1', [productId]);

      for (const spec of specs) {
        await client.query(
          `INSERT INTO product_specifications (product_id, field_key, value_ar, value_en, value_numeric, unit)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [productId, spec.field_key, spec.value_ar || null, spec.value_en || null,
           spec.value_numeric || null, spec.unit || null]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const result = await pool.query(
      'SELECT * FROM product_specifications WHERE product_id = $1',
      [productId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const deleteSpec = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT id FROM product_specifications WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Specification not found' });
    }
    await pool.query('DELETE FROM product_specifications WHERE id = $1', [id]);
    res.json({ success: true, data: { message: 'Specification deleted' } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTemplateByCategory, createTemplate, updateTemplate, deleteTemplate, reorderTemplates,
  getProductSpecs, setProductSpecs, deleteSpec,
};
