// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Polyfill for loaders
import '@loaders.gl/polyfills';

// Polyfill with JSDOM
import {JSDOM} from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html>');
// These globals are required by @jupyter-widgets/base
const _global: any = globalThis;

/** global setTimeout, clearTimeout */
_global.window = dom.window;
_global.navigator = dom.window.navigator;
_global.document = dom.window.document;
_global.Element = dom.window.Element;
_global.__JSDOM__ = true;
_global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
_global.HTMLVideoElement = dom.window.HTMLVideoElement;
_global.requestAnimationFrame = cb => setTimeout(cb, 0);
_global.cancelAnimationFrame = t => clearTimeout(t);

// import './imports-spec';
