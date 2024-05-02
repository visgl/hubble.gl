// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Tar from './tar';

type TarBuilderOptions = {
  recordsPerBlock: number;
};

const TAR_BUILDER_OPTIONS: TarBuilderOptions = {
  recordsPerBlock: 20
};

export default class TARBuilder {
  tape: Tar;
  count: number;
  options: TarBuilderOptions;

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

  constructor(options: Partial<TarBuilderOptions>) {
    this.options = {...TAR_BUILDER_OPTIONS, ...options};
    this.tape = new Tar(this.options.recordsPerBlock);
    this.count = 0;
  }

  addFile(buffer: ArrayBuffer, filename: string) {
    this.tape.append(filename, new Uint8Array(buffer));
    this.count++;
  }

  async build(): Promise<ArrayBuffer> {
    return new Response(this.tape.save()).arrayBuffer();
  }
}
