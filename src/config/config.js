import devConfig from './config.development';
import prodConfig from './config.production';
import stageConfig from './config.staging';

const configMap = {
  'production': prodConfig,
  'staging': stageConfig,
  'development': devConfig
};

const environment = process.env.NODE_ENV || 'development';
const config = configMap[environment];

export default config;