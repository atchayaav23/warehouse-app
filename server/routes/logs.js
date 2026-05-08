const router = require('express').Router();
const db = require('../db');

// GET all logs (with product name)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, p.name AS product_name
      FROM inventory_logs l
      JOIN products p ON l.product_id = p.id
      ORDER BY l.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET logs for a specific product
router.get('/product/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM inventory_logs WHERE product_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST stock IN — increases quantity
router.post('/in', async (req, res) => {
  const { product_id, quantity, note } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ error: 'product_id and quantity are required' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE products SET quantity = quantity + ? WHERE id = ?',
      [quantity, product_id]
    );
    await conn.query(
      'INSERT INTO inventory_logs (product_id, type, quantity, note) VALUES (?, "in", ?, ?)',
      [product_id, quantity, note || null]
    );
    await conn.commit();
    res.json({ message: 'Stock added successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// POST stock OUT — decreases quantity
router.post('/out', async (req, res) => {
  const { product_id, quantity, note } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ error: 'product_id and quantity are required' });

  const conn = await db.getConnection();
  try {
    // Check current stock first
    const [rows] = await conn.query('SELECT quantity FROM products WHERE id = ?', [product_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    if (rows[0].quantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    await conn.beginTransaction();
    await conn.query(
      'UPDATE products SET quantity = quantity - ? WHERE id = ?',
      [quantity, product_id]
    );
    await conn.query(
      'INSERT INTO inventory_logs (product_id, type, quantity, note) VALUES (?, "out", ?, ?)',
      [product_id, quantity, note || null]
    );
    await conn.commit();
    res.json({ message: 'Stock removed successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
