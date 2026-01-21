require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  trefleApiKey: process.env.TREFLE_TOKEN,
  trefleBaseUrl: process.env.TREFLE_BASE_URL,
};
