const router = require('express').Router();
const mongoose = require('mongoose');

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
}, { timestamps: true }));

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers.map(s => ({ id: s._id, name: s.name, email: s.email, phone: s.phone, address: s.address })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Supplier name is required' });
    const s = await Supplier.create({ name, email, phone, address });
    res.status(201).json({ message: 'Supplier added', id: s._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    await Supplier.findByIdAndUpdate(req.params.id, { name, email, phone, address });
    res.json({ message: 'Supplier updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, Supplier };
