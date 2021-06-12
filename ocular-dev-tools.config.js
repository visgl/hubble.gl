// eslint-disable-next-line no-unused-vars
const {resolve} = require('path');

module.exports = {
  lint: {
    paths: ['docs', 'modules', 'examples', 'test'],
    extensions: ['js']
  },

  // aliases: {
  //   // TEST
  //   test: resolve(__dirname, './test')
  // },

  browserTest: {
    server: {wait: 5000}
  },

  entry: {
    test: 'test/node.js',
    'test-browser': 'test/browser.js',
    bench: 'test/bench/node.js',
    'bench-browser': 'test/bench/browser.js',
    size: 'test/size/main.js'
  }
};
