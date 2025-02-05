// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
/* global fetch */
import type {FrameEncoderSettings} from '../frame-encoder';
import {GIFBuilder} from '@loaders.gl/video';
import FrameEncoder from '../frame-encoder';

type GIFOptions = {
  width: number;
  height: number;
  numWorkers: number;
  sampleInterval: number;
  jpegQuality: number;
};

export default class GifEncoder extends FrameEncoder {
  options: GIFOptions;
  gifBuilder: GIFBuilder | null = null;
  source = 'images';

  constructor(settings: FrameEncoderSettings) {
    super(settings);
    this.mimeType = 'image/gif';
    this.extension = '.gif';
    let options: GIFOptions = {
      width: 720,
      height: 480,
      numWorkers: 4,
      sampleInterval: 10,
      jpegQuality: 1.0
    };

    if (settings.gif) {
      options = {...options, ...settings.gif};
    }

    this.options = options;

    // this.source = settings.source

    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
  }

  start() {
    this.gifBuilder = new GIFBuilder({
      source: this.source,
      ...this.options,
      interval: 1 / this.framerate
    });
  }

  async add(canvas: HTMLCanvasElement) {
    if (this.source === 'images') {
      const dataUrl = canvas.toDataURL('image/jpeg', this.options.jpegQuality);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await this.gifBuilder.add(dataUrl); // @loaders.gl/gif has the wrong type
    }
  }

  async save() {
    return fetch(await this.gifBuilder.build()).then(res => res.blob());
  }
}
