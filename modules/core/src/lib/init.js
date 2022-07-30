// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import log from '../utils/log';

// Version detection using babel plugin
// Fallback for tests and SSR since global variable is defined by Webpack.
const version =
  typeof __VERSION__ !== 'undefined'
    ? __VERSION__
    : globalThis.HUBBLE_VERSION || 'untranspiled source';

// Note: a `hubble` object not created by hubble.gl may exist in the global scope
const existingVersion = globalThis.hubble && globalThis.hubble.VERSION;

if (existingVersion && existingVersion !== version) {
  throw new Error(`hubble.gl - multiple versions detected: ${existingVersion} vs ${version}`);
}

if (!existingVersion) {
  log.log(1, `hubble.gl ${version}`)();

  globalThis.hubble = {
    ...globalThis.hubble,
    VERSION: version,
    version,
    log
  };
}

export default globalThis.hubble;
