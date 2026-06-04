const pool = require('../config/db');
const { uploadToSupabase, deleteFromSupabase } = require('../utils/uploadHelper');

const getProductImages = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC',
      [req.params.productId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const addImages = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    // Check if product has existing images for primary logic
    const existingResult = await pool.query(
      'SELECT COUNT(*) FROM product_images WHERE product_id = $1', [productId]
    );
    const existingCount = parseInt(existingResult.rows[0].count);

    const insertedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { url } = await uploadToSupabase(file.buffer, file.originalname, file.mimetype, 'products');

      const isPrimary = existingCount === 0 && i === 0;
      const sortOrder = existingCount + i;

      const altAr = req.body[`alt_text_ar_${i}`] || null;
      const altEn = req.body[`alt_text_en_${i}`] || null;

      const result = await pool.query(
        `INSERT INTO product_images (product_id, image_url, alt_text_ar, alt_text_en, is_primary, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [productId, url, altAr, altEn, isPrimary, sortOrder]
      );
      insertedImages.push(result.rows[0]);
    }

    res.status(201).json({ success: true, data: insertedImages });
  } catch (err) {
    next(err);
  }
};

const updateImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { alt_text_ar, alt_text_en } = req.body;

    const result = await pool.query(
      `UPDATE product_images SET
        alt_text_ar = COALESCE($1, alt_text_ar),
        alt_text_en = COALESCE($2, alt_text_en)
       WHERE id = $3 RETURNING *`,
      [alt_text_ar, alt_text_en, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM product_images WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    const image = existing.rows[0];
    await deleteFromSupabase(image.image_url);
    if (image.thumbnail_url) await deleteFromSupabase(image.thumbnail_url);

    await pool.query('DELETE FROM product_images WHERE id = $1', [id]);

    // If deleted image was primary, set the next one as primary
    if (image.is_primary) {
      await pool.query(
        `UPDATE product_images SET is_primary = true
         WHERE id = (SELECT id FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC LIMIT 1)`,
        [image.product_id]
      );
    }

    res.json({ success: true, data: { message: 'Image deleted' } });
  } catch (err) {
    next(err);
  }
};

const setPrimary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM product_images WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    const productId = existing.rows[0].product_id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE product_images SET is_primary = false WHERE product_id = $1',
        [productId]
      );
      await client.query(
        'UPDATE product_images SET is_primary = true WHERE id = $1',
        [id]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.json({ success: true, data: { message: 'Primary image updated' } });
  } catch (err) {
    next(err);
  }
};

const reorderImages = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, sort_order }]
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        await client.query(
          'UPDATE product_images SET sort_order = $1 WHERE id = $2',
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
    res.json({ success: true, data: { message: 'Images reordered' } });
  } catch (err) {
    next(err);
  }
};

const syncImages = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { images } = req.body; // [{ image_url, is_primary, sort_order }]

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM product_images WHERE product_id = $1', [productId]);
      for (let i = 0; i < (images || []).length; i++) {
        const img = images[i];
        await client.query(
          `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [productId, img.image_url, img.is_primary || i === 0, i]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ success: true, data: { message: 'Images synced' } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProductImages, addImages, syncImages, updateImage, deleteImage, setPrimary, reorderImages };
