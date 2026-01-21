const app = require('./app');
const sequelize = require('./config/database');
const config = require('./config/config');
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync models (in production, use migrations instead)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✓ Database models synchronized');
    }

    sequelize.sync({ alter: true }).then(() => {
      console.log('✅ Database synced with new columns');
    });

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
