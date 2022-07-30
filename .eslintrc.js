const {getESLintConfig, deepMerge} = require('ocular-dev-tools');

const defaultConfig = getESLintConfig({react: '16.13.1'});

// Make any changes to default config here
const config = deepMerge(defaultConfig, {
  parserOptions: {
    project: ['./jsconfig.json'],
    ecmaVersion: 2020
  },
  extends: ['prettier'],
  env: {
    es6: true,
    browser: true
    // node: true
  },

  rules: {
    camelcase: 0,
    indent: 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0, // ['warn'],
    'no-console': 1,
    'no-continue': ['warn'],
    'callback-return': 0,
    'max-depth': ['warn', 4],
    complexity: ['warn'],
    'max-statements': ['warn'],
    'default-case': ['warn'],
    'no-eq-null': ['warn'],
    eqeqeq: ['warn'],
    radix: 0
    // 'accessor-pairs': ['error', {getWithoutSet: false, setWithoutGet: false}]
  },

  overrides: [
    {
      files: ['*.spec.js', 'webpack.config.js', '**/bundle/*.js'],
      rules: {
        'import/no-extraneous-dependencies': 0
      }
    }
  ],

  settings: {
    // Ensure eslint finds typescript files
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx']
      }
    }
  }
});

// config.overrides[1].parserOptions = {
//   project: ['./tsconfig.json']
// };

// Uncomment to log the eslint config
// console.debug(config);

module.exports = config;

// rules: {
//   'guard-for-in': 0,
//   'no-inline-comments': 0,
//   camelcase: 0,
//   'react/forbid-prop-types': 0,
//   'react/no-deprecated': 0,
//   'import/no-unresolved': ['error', {ignore: ['test']}],
//   'import/no-extraneous-dependencies': ['error', {devDependencies: false, peerDependencies: true}],
//   // 'accessor-pairs': ['error', {getWithoutSet: false, setWithoutGet: false}],
// },
