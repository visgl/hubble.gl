// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

export type FrameEncoderSettings = Partial<EncoderSettings>;

interface EncoderSettings extends FormatConfigs {
  framerate: number;
}

export interface FormatConfigs {
  png: {};
  jpeg: {
    quality: number;
  };
  webm: {
    quality: number;
  };
  gif: {
    numWorkers?: number;
    sampleInterval: number;
    width: number;
    height: number;
    jpegQuality?: number;
  };
}

export default class FrameEncoder {
  extension = '';

  mimeType = '';

  quality?: number;

  framerate: number;

  constructor(settings: FrameEncoderSettings = {}) {
    this.framerate = settings.framerate || 30;
  }

  start() {
    throw new Error('Encoder: Implement a start function');
  }
  async add(canvas: HTMLCanvasElement) {
    throw new Error('Encoder: Implement an add function');
  }
  async save(): Promise<Blob | null> {
    throw new Error('Encoder: Implement a save function');
  }
}
