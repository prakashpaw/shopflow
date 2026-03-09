const express = require('express');
const cors = require('cors');
const promClient = require('prom-client');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

// Prometheus Metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
