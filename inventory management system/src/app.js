const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express(); 


connectDB();


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/items', inventoryRoutes); 


app.get('/', (req, res) => {
  res.send('Inventory Management API is running');
});


app.use(errorHandler);

module.exports = app;
