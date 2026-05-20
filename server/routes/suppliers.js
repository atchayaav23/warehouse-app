const router = require('express').Router();
const mongoose = require('mongoose');

// Schema
const Supplier = mongoose.model('Supplier', new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
}, { timestamps: true }));

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers.map(s => ({ id: s._id, name: s.name, email: s.email, phone: s.phone, address: s.address })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single supplier
router.get('/:id', async (req, res) => {
  try {
    const s = await Supplier.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ id: s._id, name: s.name, email: s.email, phone: s.phone, address: s.address });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add supplier
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Supplier name is required' });
    const s = await Supplier.create({ name, email: email || null, phone: phone || null, address: address || null });
    res.status(201).json({ message: 'Supplier added', id: s._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update supplier
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    await Supplier.findByIdAndUpdate(req.params.id, { name, email: email || null, phone: phone || null, address: address || null });
    res.json({ message: 'Supplier updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, Supplier };