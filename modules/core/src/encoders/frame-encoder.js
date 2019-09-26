// Copyright (c) 2020 Uber Technologies, Inc.
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

import Encoder from './encoder';
export default class FrameEncoder extends Encoder {
  /** @type {string} */
  extension = '';

  /** @type {string} */
  mimeType = '';

  /** @type {number} */
  quality;

  /** @type {number} */
  framerate;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings = {}) {
    super();
    this.quality = settings.quality || 0.8;
    this.framerate = settings.framerate || 30;
    this.getMimeType = this.getMimeType.bind(this);
  }

  /** @type {() => string} */
  getMimeType() {
    return this.mimeType;
  }
}
