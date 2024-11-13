import devConfig from "./config.development";
import localConfig from "./config.local";
import stageConfig from "./config.staging";
import prodConfig from "./config.production";


const configMap = {
  development: devConfig,
  local: localConfig,
  staging: stageConfig,
  production: prodConfig,
};

const environment = "staging"; // Change this to switch environment
console.log(`Running in ${environment} mode`); 
const config = configMap[environment];

export default config;
