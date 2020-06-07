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

/* eslint-disable no-console */
/* global console, document */
import WebMWriter from 'webm-writer';
import FrameEncoder from '../frame-encoder';

/**
 * WebM Encoder
 */
class WebMEncoder extends FrameEncoder {
  /** @type {WebMWriter} */
  videoWriter;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.quality = 0.8;
    if (settings.webm && settings.webm.quality) {
      this.quality = settings.webm.quality;
    }

    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').substr(5, 10) !== 'image/webp') {
      console.error('WebP not supported - try another export format');
    }

    this.extension = '.webm';
    this.mimeType = 'video/webm';

    this.videoWriter = null;
    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
  }

  start() {
    this.videoWriter = new WebMWriter({
      quality: this.quality,
      fileWriter: null,
      fd: null,
      frameRate: this.framerate
    });
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    this.videoWriter.addFrame(canvas);
    await Promise.resolve();
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    return this.videoWriter.complete();
  }
}

export default WebMEncoder;
