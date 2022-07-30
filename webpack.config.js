const {getWebpackConfig} = require('ocular-dev-tools');

module.exports = (env) => {
  const config = getWebpackConfig(env);

  config.module.rules.push(
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    },
    {
      // Transpile ES6 to ES5 with babel
      // Remove if your app does not use JSX or you don't need to support old browsers
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/],
      options: {
        plugins: ['@babel/plugin-proposal-class-properties'],
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }
  );
  return config;
};
