// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type { FrameEncoderSettings } from '../frame-encoder';
import FrameEncoder from '../frame-encoder';
import TARBuilder from '../tar/tar-builder';
import {pad, canvasToArrayBuffer} from '../utils/index';
import {encode} from '@loaders.gl/core';
import {ZipWriter} from '@loaders.gl/zip';

const TAR = 'tar';
const ZIP = 'zip';

class JPEGSequenceEncoder extends FrameEncoder {
  tarBuilder: TARBuilder | null = null;
  filemap: {[filename: string]: ArrayBuffer} = {};
  options: {quality: number, archive?: 'tar' | 'zip'} = {quality: 1, archive: TAR}

  constructor(settings: FrameEncoderSettings) {
    super(settings);

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
        this.mimeType = ZipWriter.mimeTypes?.[0] || '';
        this.extension = `.${ZipWriter.extensions?.[0]}`;
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

  async add(canvas: HTMLCanvasElement) {
    const mimeType = 'image/jpeg';
    const extension = '.jpg';
    const buffer = await canvasToArrayBuffer(canvas, mimeType, this.options.quality);
    switch (this.options.archive) {
      case TAR: {
        if(!this.tarBuilder) {
          break;
        }
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

  async save() {
    switch (this.options.archive) {
      case TAR: {
        if(!this.tarBuilder) {
          break;
        }
        const arrayBuffer = await this.tarBuilder.build();
        return new Blob([arrayBuffer], {type: TARBuilder.properties.mimeType});
      }
      case ZIP: {
        const arrayBuffer = await encode(this.filemap, ZipWriter);
        return new Blob([arrayBuffer], {type: ZipWriter.mimeTypes?.[0]});
      }
      default: {
        throw new Error(`Unsupported archive type [zip, tar]: ${this.options.archive}`);
      }
    }
    return null;
  }
}

export default JPEGSequenceEncoder;
