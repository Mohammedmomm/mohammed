const pool = require('../config/db');
const { calculatePrices } = require('../utils/priceCalc');

const getByProduct = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY sort_order ASC',
      [req.params.productId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { variant_label_ar, variant_label_en, price_syp, price_usd, is_available, sort_order } = req.body;

    const prices = await calculatePrices(price_syp, price_usd);

    const result = await pool.query(
      `INSERT INTO product_variants (product_id, variant_label_ar, variant_label_en, price_syp, price_usd, is_available, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [productId, variant_label_ar, variant_label_en, prices.price_syp, prices.price_usd, is_available !== false, sort_order || 0]
    );

    // Mark product as having variants
    await pool.query('UPDATE products SET has_variants = true WHERE id = $1', [productId]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { variant_label_ar, variant_label_en, price_syp, price_usd, is_available, sort_order } = req.body;

    const existing = await pool.query('SELECT * FROM product_variants WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Variant not found' });
    }

    const prices = await calculatePrices(
      price_syp !== undefined ? price_syp : existing.rows[0].price_syp,
      price_usd !== undefined ? price_usd : existing.rows[0].price_usd
    );

    const result = await pool.query(
      `UPDATE product_variants SET
        variant_label_ar = COALESCE($1, variant_label_ar),
        variant_label_en = COALESCE($2, variant_label_en),
        price_syp = $3,
        price_usd = $4,
        is_available = COALESCE($5, is_available),
        sort_order = COALESCE($6, sort_order)
       WHERE id = $7 RETURNING *`,
      [variant_label_ar, variant_label_en, prices.price_syp, prices.price_usd, is_available, sort_order, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query(
      'SELECT * FROM product_variants WHERE id = $1', [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Variant not found' });
    }
    const productId = existing.rows[0].product_id;
    await pool.query('DELETE FROM product_variants WHERE id = $1', [id]);

    // Check if product still has variants
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM product_variants WHERE product_id = $1', [productId]
    );
    if (parseInt(countResult.rows[0].count) === 0) {
      await pool.query('UPDATE products SET has_variants = false WHERE id = $1', [productId]);
    }

    res.json({ success: true, data: { message: 'Variant deleted' } });
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
        await client.query(
          'UPDATE product_variants SET sort_order = $1 WHERE id = $2',
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
    res.json({ success: true, data: { message: 'Variants reordered' } });
  } catch (err) {
    next(err);
  }
};

const syncVariants = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { variants } = req.body; // [{ variant_label_ar, variant_label_en, price_syp, price_usd }]

    // Pre-calculate prices outside transaction
    const withPrices = await Promise.all(
      (variants || []).map(async (v) => {
        const prices = await calculatePrices(v.price_syp || null, v.price_usd || null);
        return { ...v, price_syp: prices.price_syp, price_usd: prices.price_usd };
      })
    );

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM product_variants WHERE product_id = $1', [productId]);
      for (let i = 0; i < withPrices.length; i++) {
        const v = withPrices[i];
        await client.query(
          `INSERT INTO product_variants (product_id, variant_label_ar, variant_label_en, price_syp, price_usd, is_available, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [productId, v.variant_label_ar, v.variant_label_en, v.price_syp, v.price_usd, true, i]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ success: true, data: { message: 'Variants synced' } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getByProduct, create, update, deleteVariant, reorder, syncVariants };
