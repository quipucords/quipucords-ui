const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react']
};
