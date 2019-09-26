// This file contains webpack configuration settings that allow
// examples to be built against the source code in this repo instead
// of building against their installed version of the modules.

const {resolve} = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const ALIASES = require('ocular-dev-tools/config/ocular.config')({
  root: resolve(__dirname, '..')
}).aliases;

// Support for hot reloading changes
const LOCAL_DEVELOPMENT_CONFIG = {
  // suppress warnings about bundle size
  devServer: {
    stats: {
      warnings: false
    }
  },

  devtool: 'source-map',

  resolve: {
    alias: Object.assign({}, ALIASES)
  },

  module: {
    rules: [
      {
        // Unfortunately, webpack doesn't import library sourcemaps on its own...
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  }
};

module.exports = config => {
  config.resolve = config.resolve || {};
  config.resolve.alias = Object.assign(
    {},
    config.resolve.alias,
    LOCAL_DEVELOPMENT_CONFIG.resolve.alias
  );

  config.module.rules = config.module.rules.concat(LOCAL_DEVELOPMENT_CONFIG.module.rules);
  config.devtool = LOCAL_DEVELOPMENT_CONFIG.devtool;
  return config;
};
