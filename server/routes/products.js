const router = require('express').Router();
const mongoose = require('mongoose');

// Schema
const Product = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  barcode: String,
  quantity: { type: Number, default: 0 },
  low_stock_threshold: { type: Number, default: 10 },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
}, { timestamps: true }));

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('supplier_id', 'name').sort({ createdAt: -1 });
    const result = products.map(p => ({
      id: p._id, name: p.name, barcode: p.barcode,
      quantity: p.quantity, low_stock_threshold: p.low_stock_threshold,
      supplier_id: p.supplier_id?._id, supplier_name: p.supplier_id?.name
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json({ id: p._id, ...p.toObject() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET by barcode
router.get('/barcode/:code', async (req, res) => {
  try {
    const p = await Product.findOne({ barcode: req.params.code });
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json({ id: p._id, ...p.toObject() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET low stock
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ['$quantity', '$low_stock_threshold'] } }).sort({ quantity: 1 });
    res.json(products.map(p => ({ id: p._id, ...p.toObject() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add product
router.post('/', async (req, res) => {
  try {
    const { name, barcode, quantity, low_stock_threshold, supplier_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Product name is required' });
    const p = await Product.create({
      name, barcode: barcode || null,
      quantity: quantity || 0,
      low_stock_threshold: low_stock_threshold || 10,
      supplier_id: supplier_id || null
    });
    res.status(201).json({ message: 'Product added', id: p._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { name, barcode, quantity, low_stock_threshold, supplier_id } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name, barcode: barcode || null,
      quantity, low_stock_threshold,
      supplier_id: supplier_id || null
    });
    res.json({ message: 'Product updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, Product };