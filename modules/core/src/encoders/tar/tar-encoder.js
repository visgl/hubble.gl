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
/* global FileReader */
import FrameEncoder from '../frame-encoder';
import {pad, getBase64, getBlob, checkIfBlank} from '../utils';
import Tar from './tar';

class TarEncoder extends FrameEncoder {
  /** @type {Tar} */
  tape;
  /** @type {number} */
  count;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.extension = '.tar';
    this.mimeType = 'application/x-tar';

    this.tape = null;
    this.count = 0;
    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  start() {
    this.dispose();
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    // getting blob from base64 encoding
    const b64 = getBase64(canvas, this.getMimeType(), this.quality);
    const blob = getBlob(b64, this.getMimeType());
    const fileReader = new FileReader();
    const waitingForLoad = new Promise((resolve, reject) => {
      // filtering out blank canvases
      if (checkIfBlank(b64)) {
        // reject('BLANK');
      }

      fileReader.onload = () => {
        if (fileReader.result instanceof ArrayBuffer) {
          this.tape.append(pad(this.count) + this.extension, new Uint8Array(fileReader.result));
        }

        this.count++;
        resolve();
      };
    });
    fileReader.readAsArrayBuffer(blob);
    await waitingForLoad;
  }

  async save() {
    return Promise.resolve(this.tape.save());
  }

  dispose() {
    this.tape = new Tar();
    this.count = 0;
  }
}

export default TarEncoder;
