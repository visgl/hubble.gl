// @ts-nocheck
const moduleExports = require('./src');

/* global window, global */
const _global = typeof window === 'undefined' ? global : window;
_global.hubble = _global.hubble || {};

Object.assign(_global.hubble, moduleExports);

module.exports = _global.hubble;
