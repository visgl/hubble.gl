const resolve = require('path').resolve;
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const {getOcularConfig} = require('ocular-dev-tools');

module.exports.onCreateWebpackConfig = function onCreateWebpackConfigOverride(opts) {
  const {
    stage, // build stage: ‘develop’, ‘develop-html’, ‘build-javascript’, or ‘build-html’
    // rules, // Object (map): set of preconfigured webpack config rules
    // plugins, // Object (map): A set of preconfigured webpack config plugins
    getConfig, // Function that returns the current webpack config
    // loaders, // Object (map): set of preconfigured webpack config loaders
    actions
  } = opts;

  console.log(`App rewriting gatsby webpack config ${stage}`); // eslint-disable-line

  const ALIASES = getOcularConfig({root: resolve(__dirname, '..')}).aliases;

  const DEPENDENCIES = require('./package.json').dependencies;

  // When duplicating example dependencies in website, autogenerate
  // aliases to ensure the website version is picked up
  // NOTE: module dependencies are automatically injected
  // TODO - should this be automatically done by ocular-gatsby?
  const dependencyAliases = {};
  // eslint-disable-next-line no-unused-vars
  for (const dependency in DEPENDENCIES) {
    dependencyAliases[dependency] = `${__dirname}/node_modules/${dependency}`;
  }

  const config = getConfig();
  // config.module.rules.push(
  //   {
  //     // Transpile ES6 to ES5 with babel
  //     // Remove if your app does not use JSX or you don't need to support old browsers
  //     test: /\.js$/,
  //     loader: 'babel-loader',
  //     exclude: [/node_modules/],
  //     options: {
  //       plugins: ['@babel/plugin-proposal-class-properties'],
  //       presets: ['@babel/preset-env', '@babel/preset-react']
  //     }
  //   }
  // );
  config.resolve = config.resolve || {};
  config.resolve.alias = Object.assign({
    'website-examples': resolve('../examples/website'),
    react: resolve('node_modules/react'),
    'react-dom': resolve('node_modules/react-dom'),
    '@luma.gl': resolve('../node_modules/@luma.gl'),
    '@loaders.gl/core': resolve('../node_modules/@loaders.gl/core'),
  }, config.resolve.alias, ALIASES, dependencyAliases);

  config.plugins = config.plugins || [];
  config.plugins.push(
    new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  );

  // Completely replace the webpack config for the current stage.
  // This can be dangerous and break Gatsby if certain configuration options are changed.
  // Generally only useful for cases where you need to handle config merging logic yourself,
  // in which case consider using webpack-merge.
  actions.replaceWebpackConfig(config);
};
