// config.js
import devConfig from './config.development';
import prodConfig from './config.production';

// Determine the environment
const isProduction = process.env.NODE_ENV === 'development';

// Use the appropriate configuration based on the environment
const config = isProduction ? devConfig : prodConfig;

export default config;
