// prettier-ignore
module.exports = {
  parser: "babel-eslint",
  extends: ['uber-jsx', 'uber-es2015', 'prettier', 'prettier/react', 'plugin:import/errors'],
  plugins: ['react', 'import', 'babel'],
  overrides: [{
    files: ['*.spec.js', 'webpack.config.js', '**/bundle/*.js'],
    rules: {
      'import/no-extraneous-dependencies': 0
    }
  }],
  rules: {
    'guard-for-in': 0,
    'no-inline-comments': 0,
    camelcase: 0,
    'react/forbid-prop-types': 0,
    'react/no-deprecated': 0,
    'import/no-unresolved': ['error', {ignore: ['test']}],
    'import/no-extraneous-dependencies': ['error', {devDependencies: false, peerDependencies: true}]
    // 'callback-return': 'off',
    // complexity: 'off',
    // 'max-statements': 'off',
    // 'no-return-assign': 'off',
    // 'func-style': 'error',
    // 'prettier/prettier': 'error',
    // 'react/no-multi-comp': 'off',
    // 'react/sort-comp': 'error',
    // 'react/jsx-no-duplicate-props': 'error',
    // 'sort-imports': 'off',

    // /* This is needed for class property function declarations */
    // 'no-invalid-this': 'off',
    // 'babel/no-invalid-this': 'error',

    // /* Style guide */
    // 'import/first': 'error',
    // 'import/no-duplicates': 'error',
    // 'import/extensions': 'error',
    // 'import/order': 'error',
    // 'import/newline-after-import': 'error',
    // 'import/extensions': 'off',

    // /* Ignore rules conflicting with prettier */
    // 'react/jsx-wrap-multilines': 'off',
    // 'react/jsx-indent': 'off',
    // 'func-style': 'off',

    // /* Use the 'query-string' module instead */
    // 'no-restricted-imports': ['error', 'querystring']
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    ecmaVersion: 2020
  }
};
