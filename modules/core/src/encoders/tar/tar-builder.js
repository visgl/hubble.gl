import Tar from './tar';
import {pad} from '../../encoders/utils';

const TAR_BUILDER_OPTIONS = {
  recordsPerBlock: 20
};

export default class TARBuilder {
  /** @type {Tar} */
  tape;
  /** @type {number} */
  count;

  static get properties() {
    return {
      id: 'tar',
      name: 'TAR',
      extensions: ['tar'],
      mimeType: 'application/x-tar',
      builder: TARBuilder,
      options: TAR_BUILDER_OPTIONS
    };
  }

  /**
   * @param {Partial<typeof TAR_BUILDER_OPTIONS>} options
   */
  constructor(options) {
    this.options = {...TAR_BUILDER_OPTIONS, ...options};

    this.tape = new Tar(this.options.recordsPerBlock);
    this.count = 0;
  }

  /**
   * @param {Blob} file
   * @param {string} extension
   */
  async add(file, extension) {
    const fileReader = new FileReader();
    const waitingForLoad = new Promise((resolve, reject) => {
      // filtering out blank canvases
      // if (checkIfBlank(b64)) {
      //   reject('BLANK');
      // }

      fileReader.onload = () => {
        if (fileReader.result instanceof ArrayBuffer) {
          this.tape.append(pad(this.count) + extension, new Uint8Array(fileReader.result));
        }

        this.count++;
        resolve();
      };
    });
    fileReader.readAsArrayBuffer(file);
    await waitingForLoad;
  }

  async build() {
    return Promise.resolve(this.tape.save());
  }
}
