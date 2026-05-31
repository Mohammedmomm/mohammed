const pool = require('../config/db');

const getCurrentRate = async (db = pool) => {
  const result = await db.query(
    'SELECT usd_to_syp FROM exchange_rate ORDER BY updated_at DESC LIMIT 1'
  );
  if (result.rows.length === 0) return 13000;
  return parseFloat(result.rows[0].usd_to_syp);
};

/**
 * Given price_syp and/or price_usd, calculate the missing one.
 * If both are provided, both are used as-is.
 * If only one is provided, derive the other using the current exchange rate.
 */
const calculatePrices = async (price_syp, price_usd, db = pool) => {
  const hasSyp = price_syp !== null && price_syp !== undefined && price_syp !== '';
  const hasUsd = price_usd !== null && price_usd !== undefined && price_usd !== '';

  if (!hasSyp && !hasUsd) {
    return { price_syp: null, price_usd: null };
  }

  const rate = await getCurrentRate(db);

  if (hasSyp && !hasUsd) {
    return {
      price_syp: parseFloat(price_syp),
      price_usd: parseFloat((parseFloat(price_syp) / rate).toFixed(4)),
    };
  }

  if (hasUsd && !hasSyp) {
    return {
      price_syp: parseFloat((parseFloat(price_usd) * rate).toFixed(2)),
      price_usd: parseFloat(price_usd),
    };
  }

  return {
    price_syp: parseFloat(price_syp),
    price_usd: parseFloat(price_usd),
  };
};

module.exports = { calculatePrices, getCurrentRate };
