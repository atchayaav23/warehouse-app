const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products',  require('./routes/products').router);
app.use('/api/suppliers', require('./routes/suppliers').router);
app.use('/api/logs',      require('./routes/logs').router);

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));