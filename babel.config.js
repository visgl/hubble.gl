// eslint-disable-next-line import/no-extraneous-dependencies
const {getBabelConfig} = require('ocular-dev-tools');

module.exports = (api) => {
  const config = getBabelConfig(api, {react: true});

  config.plugins = config.plugins || [];

  config.presets = config.presets || [];

  return config;
};
