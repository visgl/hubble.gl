// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {FrameEncoderSettings} from '../frame-encoder';
import FrameEncoder from '../frame-encoder';
import {canvasToArrayBuffer} from '../utils/index';

class PhotoEncoder extends FrameEncoder {
  blob: Blob | null;

  constructor(settings: FrameEncoderSettings) {
    super(settings);
    this.blob = null;
    this.add = this.add.bind(this);
  }

  async add(canvas: HTMLCanvasElement) {
    // Adding a frame just overwrites old image
    const buffer = await canvasToArrayBuffer(canvas, this.mimeType, this.quality);
    this.blob = new Blob([buffer], {type: this.mimeType});
    return Promise.resolve();
  }

  async save() {
    return Promise.resolve(this.blob);
  }
}

export default PhotoEncoder;
