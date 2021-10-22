// Copyright (c) 2021 Uber Technologies, Inc.
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
import TARBuilder from '../tar/tar-builder';
import {pad, canvasToArrayBuffer} from '../utils';
import {encode} from '@loaders.gl/core';
import {ZipWriter} from '@loaders.gl/zip';

const TAR = 'tar';
const ZIP = 'zip';

class JPEGSequenceEncoder extends FrameEncoder {
  /** @type {TARBuilder} */
  tarBuilder;

  /** @type {{filename: ArrayBuffer}} */
  filemap;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.tarBuilder = null;
    this.filemap = {};
    this.options = {};

    if (settings.jpeg) {
      this.options = {...settings.jpeg};
    }

    this.options.quality = this.options.quality || 1.0;
    this.options.archive = this.options.archive || TAR;

    switch (this.options.archive) {
      case TAR: {
        this.mimeType = TARBuilder.properties.mimeType;
        this.extension = `.${TARBuilder.properties.extensions[0]}`;
        break;
      }
      case ZIP: {
        this.mimeType = ZipWriter.mimeTypes[0];
        this.extension = `.${ZipWriter.extensions[0]}`;
        break;
      }
      default: {
        throw new Error(`Unsupported archive type [zip, tar]: ${this.options.archive}`);
      }
    }
  }

  start() {
    this.tarBuilder = new TARBuilder({});
    this.filemap = {};
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    const mimeType = 'image/jpeg';
    const extension = '.jpg';
    const buffer = await canvasToArrayBuffer(canvas, mimeType, this.options.quality);
    switch (this.options.archive) {
      case TAR: {
        const filename = pad(this.tarBuilder.count) + extension;
        this.tarBuilder.addFile(buffer, filename);
        break;
      }
      case ZIP: {
        const filename = pad(Object.keys(this.filemap).length) + extension;
        this.filemap[filename] = buffer;
        break;
      }
      default: {
        throw new Error(`Unsupported archive type [zip, tar]: ${this.options.archive}`);
      }
    }
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    switch (this.options.archive) {
      case TAR: {
        const arrayBuffer = await this.tarBuilder.build();
        return new Blob([arrayBuffer], {type: TARBuilder.properties.mimeType});
      }
      case ZIP: {
        const arrayBuffer = await encode(this.filemap, ZipWriter);
        return new Blob([arrayBuffer], {type: ZipWriter.mimeTypes[0]});
      }
      default: {
        throw new Error(`Unsupported archive type [zip, tar]: ${this.options.archive}`);
      }
    }
  }
}

export default JPEGSequenceEncoder;
