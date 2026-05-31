/**
 * Normalize Arabic text for consistent search and comparison.
 * - Replaces أإآ with ا
 * - Replaces ة with ه
 * - Replaces ى with ي
 * - Collapses multiple spaces into one
 * - Trims and lowercases
 */
const normalizeArabic = (text) => {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

module.exports = { normalizeArabic };
