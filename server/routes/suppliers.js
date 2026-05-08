const router = require('express').Router();
const db = require('../db');

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single supplier
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add supplier
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Supplier name is required' });
    const [result] = await db.query(
      'INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email || null, phone || null, address || null]
    );
    res.status(201).json({ message: 'Supplier added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update supplier
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    await db.query(
      'UPDATE suppliers SET name=?, email=?, phone=?, address=? WHERE id=?',
      [name, email || null, phone || null, address || null, req.params.id]
    );
    res.json({ message: 'Supplier updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
