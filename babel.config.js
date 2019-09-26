// eslint-disable-next-line import/no-extraneous-dependencies
const getBabelConfig = require('ocular-dev-tools/config/babel.config');

module.exports = api => {
  const config = getBabelConfig(api);
  // config.presets = config.presets || [];
  // config.presets.push(
  //   '@babel/preset-env'
  // )
  // console.log(config.root)

  config.plugins = config.plugins || [];
  config.plugins.push('@babel/plugin-proposal-class-properties');

  config.presets = config.presets || [];
  config.presets.push('@babel/preset-react');

  return config;
};
