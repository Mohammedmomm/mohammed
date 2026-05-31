const pool = require('../config/db');

/**
 * Generate a URL-safe slug from text.
 * For Arabic text, we transliterate common letters or fallback to a timestamp suffix.
 */
const arabicToLatin = {
  ا: 'a', أ: 'a', إ: 'a', آ: 'a', ب: 'b', ت: 't', ث: 'th', ج: 'j',
  ح: 'h', خ: 'kh', د: 'd', ذ: 'th', ر: 'r', ز: 'z', س: 's', ش: 'sh',
  ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: 'a', غ: 'gh', ف: 'f', ق: 'q',
  ك: 'k', ل: 'l', م: 'm', ن: 'n', ه: 'h', ة: 'h', و: 'w', ي: 'y',
  ى: 'a', ء: '', ئ: 'y', ؤ: 'w',
};

const generateSlug = (text) => {
  if (!text) return `item-${Date.now()}`;

  // Transliterate Arabic characters
  let slug = text
    .split('')
    .map((char) => arabicToLatin[char] !== undefined ? arabicToLatin[char] : char)
    .join('');

  // Lowercase, replace spaces and special chars with hyphens
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    slug = `item-${Date.now()}`;
  }

  return slug;
};

/**
 * Ensure a slug is unique in the given table.
 * Appends -2, -3, etc. until unique.
 */
const ensureUniqueSlug = async (baseSlug, table, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = `SELECT id FROM ${table} WHERE slug = $1`;
    const params = [slug];

    if (excludeId) {
      query += ` AND id != $2`;
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return slug;
    }

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
};

module.exports = { generateSlug, ensureUniqueSlug };
