const router = require('express').Router();
const mongoose = require('mongoose');
const { Product } = require('./products');

// Schema
const Log = mongoose.model('Log', new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  note: String,
}, { timestamps: true }));

// GET all logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().populate('product_id', 'name').sort({ createdAt: -1 });
    res.json(logs.map(l => ({
      id: l._id, product_id: l.product_id?._id,
      product_name: l.product_id?.name,
      type: l.type, quantity: l.quantity,
      note: l.note, created_at: l.createdAt
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET logs for specific product
router.get('/product/:id', async (req, res) => {
  try {
    const logs = await Log.find({ product_id: req.params.id }).sort({ createdAt: -1 });
    res.json(logs.map(l => ({ id: l._id, ...l.toObject() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST stock IN
router.post('/in', async (req, res) => {
  const { product_id, quantity, note } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ error: 'product_id and quantity are required' });
  try {
    await Product.findByIdAndUpdate(product_id, { $inc: { quantity: quantity } });
    await Log.create({ product_id, type: 'in', quantity, note: note || null });
    res.json({ message: 'Stock added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST stock OUT
router.post('/out', async (req, res) => {
  const { product_id, quantity, note } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ error: 'product_id and quantity are required' });
  try {
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.quantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });
    await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -quantity } });
    await Log.create({ product_id, type: 'out', quantity, note: note || null });
    res.json({ message: 'Stock removed successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router };