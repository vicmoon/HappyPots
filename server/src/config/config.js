require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  perenualApiKey: process.env.PERENUAL_API_KEY,
  perenualBaseUrl: process.env.PERENUAL_BASE_URL || 'https://perenual.com/api',
};
