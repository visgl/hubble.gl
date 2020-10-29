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
import FrameEncoder from '../frame-encoder';
import {canvasToArrayBuffer} from '../utils';

class PhotoEncoder extends FrameEncoder {
  /** @type {Blob} */
  blob;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.blob = null;
    this.add = this.add.bind(this);
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    // Adding a frame just overwrites old image
    const buffer = await canvasToArrayBuffer(canvas, this.mimeType, this.quality);
    this.blob = new Blob([buffer], {type: this.mimeType});
    return Promise.resolve();
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    return Promise.resolve(this.blob);
  }
}

export default PhotoEncoder;
