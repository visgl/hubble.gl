import {GIFBuilder} from '@loaders.gl/video';
import FrameEncoder from '../frame-encoder';

export default class GifEncoder extends FrameEncoder {
  /**
   * @type {{width: number, height: number, numWorkers: number, sampleInterval: number, jpegQuality: number}}
   */
  options;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.mimeType = 'image/gif';
    this.extension = '.gif';
    this.gifBuilder = null;
    this.options = {};

    if (settings.gif) {
      this.options = {...settings.gif};
    }

    this.options.width = this.options.width || 720;
    this.options.height = this.options.height || 480;
    this.options.numWorkers = this.options.numWorkers || 4;
    this.options.sampleInterval = this.options.sampleInterval || 10;
    this.options.jpegQuality = this.options.jpegQuality || 1.0;

    // this.source = settings.source
    this.source = 'images';

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

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    if (this.source === 'images') {
      const dataUrl = canvas.toDataURL('image/jpeg', this.options.jpegQuality);
      await this.gifBuilder.add(dataUrl);
    }
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    return fetch(await this.gifBuilder.build()).then(res => res.blob());
  }
}
