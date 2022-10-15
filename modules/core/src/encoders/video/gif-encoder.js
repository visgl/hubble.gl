import {GIFBuilder} from '@loaders.gl/video';
import FrameEncoder from '../frame-encoder';

export default class GIFEncoder extends FrameEncoder {
  /**
   * @type {{width: number, height: number, numWorkers: number, sampleInterval: number, jpegQuality: number}}
   */
  settings;

  /** @param {import('types').GIFSettings} settings */
  constructor(settings) {
    super(settings);
    this.mimeType = 'image/gif';
    this.extension = '.gif';
    this.gifBuilder = null;
    this.settings = {};

    if (settings) {
      this.settings = {...settings};
    }

    this.settings.width = this.settings.width || 720;
    this.settings.height = this.settings.height || 480;
    this.settings.numWorkers = this.settings.numWorkers || 4;
    this.settings.sampleInterval = this.settings.sampleInterval || 10;
    this.settings.jpegQuality = this.settings.jpegQuality || 1.0;

    // this.source = settings.source
    this.source = 'images';

    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
  }

  start() {
    this.gifBuilder = new GIFBuilder({
      source: this.source,
      ...this.settings,
      interval: 1 / this.framerate
    });
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    if (this.source === 'images') {
      const dataUrl = canvas.toDataURL('image/jpeg', this.settings.jpegQuality);
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
