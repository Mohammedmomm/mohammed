const pool = require('../config/db');
const { generateSlug, ensureUniqueSlug } = require('../utils/slugify');
const { calculatePrices, getCurrentRate } = require('../utils/priceCalc');
const { paginate, paginateResponse } = require('../utils/pagination');
const { normalizeArabic } = require('../utils/arabicNormalize');

const list = async (req, res, next) => {
  try {
    const {
      category, brand, available, featured,
      min_price, max_price, sort, search,
      page: qPage, limit: qLimit,
    } = req.query;

    const { page, limit, offset } = paginate(qPage, qLimit);

    const conditions = [];
    const params = [];

    if (category) {
      // Collect all descendant category IDs recursively via CTE
      params.push(parseInt(category));
      conditions.push(
        `p.category_id IN (
          WITH RECURSIVE cat_tree AS (
            SELECT id FROM categories WHERE id = $${params.length}
            UNION ALL
            SELECT c.id FROM categories c INNER JOIN cat_tree ct ON c.parent_id = ct.id
          ) SELECT id FROM cat_tree
        )`
      );
    }

    if (brand) {
      params.push(parseInt(brand));
      conditions.push(`p.brand_id = $${params.length}`);
    }

    if (available !== undefined && available !== '') {
      params.push(available === 'true');
      conditions.push(`p.is_available = $${params.length}`);
    }

    if (featured !== undefined && featured !== '') {
      params.push(featured === 'true');
      conditions.push(`p.is_featured = $${params.length}`);
    }

    if (min_price) {
      params.push(parseFloat(min_price));
      conditions.push(`p.price_syp >= $${params.length}`);
    }

    if (max_price) {
      params.push(parseFloat(max_price));
      conditions.push(`p.price_syp <= $${params.length}`);
    }

    if (search) {
      const normalized = normalizeArabic(search);
      const searchParam = `%${search}%`;
      const normalizedParam = `%${normalized}%`;
      params.push(searchParam, normalizedParam);
      const sIdx = params.length - 1;
      const nIdx = params.length;
      conditions.push(
        `(p.name_ar ILIKE $${sIdx} OR p.name_en ILIKE $${sIdx} OR
          normalize_arabic(p.name_ar) ILIKE $${nIdx} OR
          p.meta_keywords ILIKE $${sIdx})`
      );
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = 'ORDER BY p.created_at DESC';
    if (sort === 'price_asc') orderClause = 'ORDER BY p.price_syp ASC NULLS LAST';
    else if (sort === 'price_desc') orderClause = 'ORDER BY p.price_syp DESC NULLS LAST';
    else if (sort === 'name_ar') orderClause = 'ORDER BY p.name_ar ASC';
    else if (sort === 'name_en') orderClause = 'ORDER BY p.name_en ASC';
    else if (sort === 'popular') orderClause = 'ORDER BY p.view_count DESC';
    else if (sort === 'featured') orderClause = 'ORDER BY p.is_featured DESC, p.created_at DESC';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const result = await pool.query(
      `SELECT p.*,
        c.name_ar AS category_name_ar, c.name_en AS category_name_en, c.slug AS category_slug,
        b.name AS brand_name, b.name_ar AS brand_name_ar, b.slug AS brand_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       ${whereClause}
       ${orderClause}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ success: true, data: paginateResponse(result.rows, total, page, limit) });
  } catch (err) {
    next(err);
  }
};

const getFullProduct = async (idOrSlug, bySlug = false) => {
  const whereClause = bySlug ? 'p.slug = $1' : 'p.id = $1';

  const productResult = await pool.query(
    `SELECT p.*,
      c.id AS cat_id, c.name_ar AS category_name_ar, c.name_en AS category_name_en, c.slug AS category_slug,
      c.parent_id AS cat_parent_id,
      pc.name_ar AS parent_category_name_ar, pc.name_en AS parent_category_name_en, pc.slug AS parent_category_slug,
      b.name AS brand_name, b.name_ar AS brand_name_ar, b.slug AS brand_slug, b.logo_url AS brand_logo_url
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     LEFT JOIN categories pc ON c.parent_id = pc.id
     LEFT JOIN brands b ON p.brand_id = b.id
     WHERE ${whereClause}`,
    [idOrSlug]
  );

  if (productResult.rows.length === 0) return null;
  const product = productResult.rows[0];

  const [imagesResult, specsResult, variantsResult, rateResult] = await Promise.all([
    pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC',
      [product.id]
    ),
    pool.query(
      `SELECT ps.*, st.label_ar, st.label_en, st.field_type, st.unit AS template_unit
       FROM product_specifications ps
       LEFT JOIN specification_templates st ON ps.field_key = st.field_key AND st.category_id = $2
       WHERE ps.product_id = $1
       ORDER BY st.sort_order ASC NULLS LAST`,
      [product.id, product.category_id]
    ),
    pool.query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY sort_order ASC',
      [product.id]
    ),
    pool.query('SELECT usd_to_syp FROM exchange_rate ORDER BY updated_at DESC LIMIT 1'),
  ]);

  const exchangeRate = rateResult.rows.length > 0 ? parseFloat(rateResult.rows[0].usd_to_syp) : 13000;

  return {
    ...product,
    images: imagesResult.rows,
    specifications: specsResult.rows,
    variants: variantsResult.rows,
    exchange_rate: exchangeRate,
  };
};

const getById = async (req, res, next) => {
  try {
    const product = await getFullProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Increment view_count asynchronously
    pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [product.id]).catch(() => {});
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const product = await getFullProduct(req.params.slug, true);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [product.id]).catch(() => {});
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const getSimilar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productResult = await pool.query(
      'SELECT id, category_id FROM products WHERE id = $1',
      [id]
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const { category_id } = productResult.rows[0];

    let similar = [];

    if (category_id) {
      const result = await pool.query(
        `SELECT p.*,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS primary_image
         FROM products p
         WHERE p.category_id = $1 AND p.id != $2 AND p.is_available = true
         ORDER BY p.is_featured DESC, p.created_at DESC LIMIT 8`,
        [category_id, id]
      );
      similar = result.rows;

      if (similar.length < 4) {
        // Fallback to parent category
        const catResult = await pool.query(
          'SELECT parent_id FROM categories WHERE id = $1',
          [category_id]
        );
        if (catResult.rows.length > 0 && catResult.rows[0].parent_id) {
          const parentId = catResult.rows[0].parent_id;
          const siblingResult = await pool.query(
            `SELECT p.*,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS primary_image
             FROM products p
             INNER JOIN categories c ON p.category_id = c.id
             WHERE c.parent_id = $1 AND p.id != $2 AND p.is_available = true
             ORDER BY p.is_featured DESC, p.created_at DESC LIMIT 8`,
            [parentId, id]
          );
          similar = siblingResult.rows;
        }
      }
    }

    res.json({ success: true, data: similar.slice(0, 8) });
  } catch (err) {
    next(err);
  }
};

const getImages = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC',
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getSpecs = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT ps.*, st.label_ar, st.label_en, st.field_type
       FROM product_specifications ps
       LEFT JOIN specification_templates st ON ps.field_key = st.field_key
       WHERE ps.product_id = $1`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getVariants = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY sort_order ASC',
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const {
      name_ar, name_en, description_ar, description_en,
      category_id, brand_id, price_syp, price_usd,
      has_variants, has_details, is_available, is_featured,
      tags, meta_keywords,
    } = req.body;

    const prices = await calculatePrices(price_syp, price_usd);
    const baseSlug = generateSlug(name_en || name_ar);
    const slug = await ensureUniqueSlug(baseSlug, 'products');

    const result = await pool.query(
      `INSERT INTO products
        (name_ar, name_en, slug, description_ar, description_en, category_id, brand_id,
         price_syp, price_usd, has_variants, has_details, is_available, is_featured, tags, meta_keywords)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        name_ar, name_en, slug, description_ar || null, description_en || null,
        category_id || null, brand_id || null,
        prices.price_syp, prices.price_usd,
        has_variants || false, has_details !== false,
        is_available !== false, is_featured || false,
        tags || null, meta_keywords || null,
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
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const {
      name_ar, name_en, description_ar, description_en,
      category_id, brand_id, price_syp, price_usd,
      has_variants, has_details, is_available, is_featured,
      tags, meta_keywords,
    } = req.body;

    const prices = await calculatePrices(
      price_syp !== undefined ? price_syp : existing.rows[0].price_syp,
      price_usd !== undefined ? price_usd : existing.rows[0].price_usd
    );

    const result = await pool.query(
      `UPDATE products SET
        name_ar = COALESCE($1, name_ar),
        name_en = COALESCE($2, name_en),
        description_ar = COALESCE($3, description_ar),
        description_en = COALESCE($4, description_en),
        category_id = COALESCE($5, category_id),
        brand_id = COALESCE($6, brand_id),
        price_syp = $7,
        price_usd = $8,
        has_variants = COALESCE($9, has_variants),
        has_details = COALESCE($10, has_details),
        is_available = COALESCE($11, is_available),
        is_featured = COALESCE($12, is_featured),
        tags = COALESCE($13, tags),
        meta_keywords = COALESCE($14, meta_keywords)
       WHERE id = $15 RETURNING *`,
      [
        name_ar, name_en, description_ar, description_en,
        category_id, brand_id,
        prices.price_syp, prices.price_usd,
        has_variants, has_details, is_available, is_featured,
        tags, meta_keywords, id,
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true, data: { message: 'Product deleted' } });
  } catch (err) {
    next(err);
  }
};

const toggleAvailable = async (req, res, next) => {
  try {
    const result = await pool.query(
      'UPDATE products SET is_available = NOT is_available WHERE id = $1 RETURNING id, is_available',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const toggleFeatured = async (req, res, next) => {
  try {
    const result = await pool.query(
      'UPDATE products SET is_featured = NOT is_featured WHERE id = $1 RETURNING id, is_featured',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const bulkPriceUpdate = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, price_syp, price_usd }]
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of items) {
        const prices = await calculatePrices(item.price_syp, item.price_usd);
        await client.query(
          'UPDATE products SET price_syp = $1, price_usd = $2 WHERE id = $3',
          [prices.price_syp, prices.price_usd, item.id]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ success: true, data: { message: `Updated ${items.length} products` } });
  } catch (err) {
    next(err);
  }
};

const bulkPricePercent = async (req, res, next) => {
  try {
    const { ids, percent, direction } = req.body; // direction: 'increase' | 'decrease'
    if (!ids || !ids.length) {
      return res.status(400).json({ success: false, error: 'ids array required' });
    }
    const factor = direction === 'decrease'
      ? 1 - parseFloat(percent) / 100
      : 1 + parseFloat(percent) / 100;

    await pool.query(
      `UPDATE products SET
        price_syp = ROUND(price_syp * $1, 2),
        price_usd = ROUND(price_usd * $1, 4)
       WHERE id = ANY($2)`,
      [factor, ids]
    );
    res.json({ success: true, data: { message: `Prices updated for ${ids.length} products` } });
  } catch (err) {
    next(err);
  }
};

const priceByName = async (req, res, next) => {
  try {
    const { name_pattern, price_syp, price_usd } = req.body;
    if (!name_pattern) {
      return res.status(400).json({ success: false, error: 'name_pattern required' });
    }
    const prices = await calculatePrices(price_syp, price_usd);
    const result = await pool.query(
      `UPDATE products SET price_syp = $1, price_usd = $2
       WHERE name_ar ILIKE $3 OR name_en ILIKE $3`,
      [prices.price_syp, prices.price_usd, `%${name_pattern}%`]
    );
    res.json({ success: true, data: { message: `Updated ${result.rowCount} products` } });
  } catch (err) {
    next(err);
  }
};

const priceSearch = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);

    const params = [];
    let whereClause = '';
    if (search) {
      params.push(`%${search}%`);
      whereClause = `WHERE name_ar ILIKE $1 OR name_en ILIKE $1`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products ${whereClause}`, params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const result = await pool.query(
      `SELECT id, name_ar, name_en, price_syp, price_usd, is_available
       FROM products ${whereClause}
       ORDER BY name_en ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ success: true, data: paginateResponse(result.rows, total, page, limit) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list, getById, getBySlug, getSimilar,
  getImages, getSpecs, getVariants,
  create, update, deleteProduct,
  toggleAvailable, toggleFeatured,
  bulkPriceUpdate, bulkPricePercent, priceByName, priceSearch,
};
