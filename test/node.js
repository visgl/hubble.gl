const {resolve} = require('path');

// require('reify');
require('@babel/register')({
  configFile: resolve('babel.config.js')
});

// require('./dev-modules');
require('./modules');
