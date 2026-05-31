const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('./config/env');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const brandRoutes = require('./routes/brands');
const productRoutes = require('./routes/products');
const variantRoutes = require('./routes/variants');
const specificationRoutes = require('./routes/specifications');
const imageRoutes = require('./routes/images');
const adRoutes = require('./routes/ads');
const exchangeRateRoutes = require('./routes/exchangeRate');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

const app = express();

// CORS
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:productId/variants', variantRoutes);
app.use('/api/products/:productId/images', imageRoutes);
app.use('/api/specifications', specificationRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/exchange-rate', exchangeRateRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// 404
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
