const { Sequelize } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config();

// Test connection with pg client first
const testConnection = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'plant_library',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    await client.connect();
    console.log('✓ Raw pg connection successful');
    await client.end();
  } catch (err) {
    console.error('✗ Raw pg connection failed:', err.message);
    throw err;
  }
};

testConnection();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'plant_library',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Disable logging temporarily
    dialectOptions: {
      // Try without SSL
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
