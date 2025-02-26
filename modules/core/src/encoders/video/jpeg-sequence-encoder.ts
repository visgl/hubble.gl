// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {FrameEncoderSettings} from '../frame-encoder';
import FrameEncoder from '../frame-encoder';
import {pad, canvasToArrayBuffer} from '../utils/index';
import {encode} from '@loaders.gl/core';
import {ZipWriter} from '@loaders.gl/zip';

class JPEGSequenceEncoder extends FrameEncoder {
  filemap: {[filename: string]: ArrayBuffer} = {};
  options: {quality: number} = {quality: 1};

  constructor(settings: FrameEncoderSettings) {
    super(settings);

    if (settings.jpeg) {
      this.options = {...settings.jpeg};
    }

    this.options.quality = this.options.quality || 1.0;

    this.mimeType = ZipWriter.mimeTypes?.[0] || '';
    this.extension = `.${ZipWriter.extensions?.[0]}`;
  }

  start() {
    this.filemap = {};
  }

  async add(canvas: HTMLCanvasElement) {
    const mimeType = 'image/jpeg';
    const extension = '.jpg';
    const buffer = await canvasToArrayBuffer(canvas, mimeType, this.options.quality);
    const filename = pad(Object.keys(this.filemap).length) + extension;
    this.filemap[filename] = buffer;
  }

  async save() {
    const arrayBuffer = await encode(this.filemap, ZipWriter);
    return new Blob([arrayBuffer], {type: ZipWriter.mimeTypes?.[0]});
  }
}

export default JPEGSequenceEncoder;
