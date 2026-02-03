// src/server.js
const app = require('./app');
const sequelize = require('./config/database');
const config = require('./config/config');
const cors = require('cors');

app.use(cors());

// Global process handlers to log why the process exits
process.on('exit', (code) => {
  console.log(`[process] exit event with code: ${code}`);
});
process.on('uncaughtException', (err) => {
  console.error(
    '[process] uncaughtException',
    err && err.stack ? err.stack : err
  );
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[process] unhandledRejection', { reason, promise });
});

const startServer = async () => {
  try {
    console.log('[startup] starting server bootstrap...');
    console.log('[startup] config:', {
      port: config.port,
      nodeEnv: config.nodeEnv,
    });

    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync models (in development only)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✓ Database models synchronized (alter applied)');
    }

    // Start server and keep it alive
    const PORT = config.port || 5001;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });

    // Log server 'close' event
    server.on('close', () => {
      console.log('[server] http server closed');
    });
  } catch (error) {
    console.error(
      '✗ Unable to start server (fatal):',
      error && error.stack ? error.stack : error
    );
    // Do NOT swallow errors — exit with code 1 so nodemon shows failure
    process.exit(1);
  }
};

startServer();
