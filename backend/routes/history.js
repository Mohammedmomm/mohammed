const express = require('express');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/history
router.post('/', authMiddleware, async (req, res) => {
  const { calculatorType, inputData, resultData } = req.body;

  if (!calculatorType || !inputData || !resultData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['age', 'bmi'].includes(calculatorType)) {
    return res.status(400).json({ error: 'Invalid calculator type' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO calculator_history (user_id, calculator_type, input_data, result_data)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, calculatorType, JSON.stringify(inputData), JSON.stringify(resultData)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Save history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, calculator_type, input_data, result_data, created_at
       FROM calculator_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/history/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM calculator_history WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
