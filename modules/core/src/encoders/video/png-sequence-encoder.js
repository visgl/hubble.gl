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
import TARBuilder from '../tar/tar-builder';
import FrameEncoder from '../frame-encoder';
import {getBlob, getBase64} from '../utils';
class PNGSequenceEncoder extends FrameEncoder {
  /** @type {TARBuilder} */
  tarBuilder;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.mimeType = TARBuilder.properties.mimeType;
    this.extension = `.${TARBuilder.properties.extensions[0]}`;
    this.tarBuilder = null;
  }

  start() {
    this.tarBuilder = new TARBuilder({});
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    const mimeType = 'image/png';
    const extension = '.png';
    // getting blob from base64 encoding
    const b64 = getBase64(canvas, mimeType);
    const blob = getBlob(b64, mimeType);
    await this.tarBuilder.add(blob, extension);
  }

  async save() {
    return this.tarBuilder.build();
  }
}

export default PNGSequenceEncoder;
