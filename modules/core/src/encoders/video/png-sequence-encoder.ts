// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {encode} from '@loaders.gl/core';
import {ZipWriter} from '@loaders.gl/zip';
import type {FrameEncoderSettings} from '../frame-encoder';
import FrameEncoder from '../frame-encoder';
import {pad, canvasToArrayBuffer} from '../utils/index';

class PNGSequenceEncoder extends FrameEncoder {
  filemap: {[filename: string]: ArrayBuffer} = {};
  options: {} = {};

  constructor(settings: FrameEncoderSettings) {
    super(settings);

    if (settings.png) {
      this.options = {...settings.png};
    }

    this.mimeType = ZipWriter.mimeTypes[0] || '';
    this.extension = `.${ZipWriter.extensions[0]}`;
  }

  start() {
    this.filemap = {};
  }

  async add(canvas: HTMLCanvasElement) {
    const mimeType = 'image/png';
    const extension = '.png';
    const buffer = await canvasToArrayBuffer(canvas, mimeType);
    const filename = pad(Object.keys(this.filemap).length) + extension;
    this.filemap[filename] = buffer;
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    const arrayBuffer = await encode(this.filemap, ZipWriter);
    return new Blob([arrayBuffer], {type: ZipWriter.mimeTypes?.[0]});
  }
}

export default PNGSequenceEncoder;
