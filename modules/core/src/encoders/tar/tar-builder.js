import Tar from './tar';

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
   * @param {ArrayBuffer} buffer
   * @param {string} filename
   */
  addFile(buffer, filename) {
    this.tape.append(filename, new Uint8Array(buffer));
    this.count++;
  }

  /**
   * @returns {Promise<ArrayBuffer>}
   */
  async build() {
    return new Response(this.tape.save()).arrayBuffer();
  }
}
