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

/* global MediaRecorder, Blob */
import FrameEncoder from '../frame-encoder';

/*
  HTMLCanvasElement.captureStream()
*/
class StreamEncoder extends FrameEncoder {
  /** @type {MediaStream} */
  stream;
  /** @type {MediaRecorder} */
  mediaRecorder;
  /** @type {Blob[]} */
  chunks;

  /**
   * @param {import('types').FrameEncoderSettings} settings
   */
  constructor(settings) {
    super(settings);
    this.mimeType = 'video/webm';
    this.extension = '.webm';
    this.stream = null;
    this.mediaRecorder = null;
    this.chunks = [];
    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
  }

  start() {
    this.stream = null;
    this.mediaRecorder = null;
    this.chunks = [];
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  async add(canvas) {
    if (!this.stream) {
      this.stream = canvas.captureStream(this.framerate);
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.start();

      this.mediaRecorder.ondataavailable = e => {
        this.chunks.push(e.data);
      };
    }
    return Promise.resolve();
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    /** @type Promise<Blob> */
    const waiting = new Promise(resolve => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, {type: 'video/webm'});
        this.chunks = [];
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });

    return waiting;
  }
}

export default StreamEncoder;
