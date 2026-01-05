const app = require('./app');
const sequelize = require('./config/database');
const config = require('./config/config');

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
