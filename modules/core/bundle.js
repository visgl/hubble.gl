// @ts-nocheck
/* global window, global */
const moduleExports = require('./src');

const _global = typeof window === 'undefined' ? global : window;
// const hubble = _global.hubble || {};

module.exports = Object.assign(_global.hubble, moduleExports);
