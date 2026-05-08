const router = require('express').Router();
const db = require('../db');

// GET all products (with supplier name joined)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, s.name AS supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET product by barcode
router.get('/barcode/:code', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE barcode = ?', [req.params.code]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET low stock alerts
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE quantity <= low_stock_threshold ORDER BY quantity ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new product
router.post('/', async (req, res) => {
  try {
    const { name, barcode, quantity, low_stock_threshold, supplier_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Product name is required' });
    const [result] = await db.query(
      'INSERT INTO products (name, barcode, quantity, low_stock_threshold, supplier_id) VALUES (?, ?, ?, ?, ?)',
      [name, barcode || null, quantity || 0, low_stock_threshold || 10, supplier_id || null]
    );
    res.status(201).json({ message: 'Product added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { name, barcode, quantity, low_stock_threshold, supplier_id } = req.body;
    await db.query(
      'UPDATE products SET name=?, barcode=?, quantity=?, low_stock_threshold=?, supplier_id=? WHERE id=?',
      [name, barcode || null, quantity, low_stock_threshold, supplier_id || null, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
