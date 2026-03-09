const express = require('express');
const cors = require('cors');
const promClient = require('prom-client');
const productRoutes = require('./routes/products');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static uploaded images
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Prometheus Metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.use('/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
