import {GIFBuilder} from '@loaders.gl/video';
import FrameEncoder from '../frame-encoder';

export default class GifEncoder extends FrameEncoder {
  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.mimeType = 'image/gif';
    this.extension = '.gif';
    this.gifBuilder = null;

    // this.source = settings.source
    this.source = 'images';

    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  start() {
    this.gifBuilder = new GIFBuilder({source: this.source, width: 720, height: 480, numWorkers: 4});
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    if (this.source === 'images') {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      await this.gifBuilder.add(dataUrl);
    }
  }

  async save() {
    return this.gifBuilder.build();
  }

  dispose() {
    this.gifBuilder = null;
  }
}
