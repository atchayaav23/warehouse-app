const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products',  require('./routes/products'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/logs',      require('./routes/logs'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Inventory API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
