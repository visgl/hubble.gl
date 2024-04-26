// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable no-console */
import type { FrameEncoderSettings } from '../frame-encoder';
import WebMWriter from 'webm-writer';
import FrameEncoder from '../frame-encoder';

/**
 * WebM Encoder
 */
class WebMEncoder extends FrameEncoder {
  videoWriter: WebMWriter;

  constructor(settings: FrameEncoderSettings) {
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

  async add(canvas: HTMLCanvasElement) {
    this.videoWriter.addFrame(canvas);
    await Promise.resolve();
  }

  async save() {
    return this.videoWriter.complete();
  }
}

export default WebMEncoder;
