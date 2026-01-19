const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const plantRoutes = require('./routes/plantRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ✅ CORS FIRST
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// ✅ Helmet with CORS-friendly config
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/plants', plantRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
