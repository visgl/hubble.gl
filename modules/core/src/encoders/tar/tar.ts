// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import * as utils from './utils';
import * as header from './header';

let blockSize: number;
const recordSize = 512;

type Block = {
  header: any;
  input: Uint8Array;
  headerLength: number;
  inputLength: number;
};

class Tar {
  blocks: Block[];
  written: number;
  length: number;
  out: Uint8Array;

  constructor(recordsPerBlock: number) {
    this.written = 0;
    blockSize = (recordsPerBlock || 20) * recordSize;
    this.out = utils.clean(blockSize);
    this.blocks = [];
    this.length = 0;
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.append = this.append.bind(this);
  }

  append(
    filepath: string,
    input: string | Uint8Array,
    opts: {mode?: number; mtime?: number; uid?: any; gid?: number; owner?: any; group?: any} = {}
  ) {
    let checksum: number;

    if (typeof input === 'string') {
      input = utils.stringToUint8(input);
    } else if (input?.constructor && input.constructor !== Uint8Array.prototype.constructor) {
      const errorInput = input.constructor
        .toString()
        .match(/function\s*([$A-Za-z_][0-9A-Za-z_]*)\s*\(/)
        ?.at(1);
      const errorMessage = `Invalid input type. You gave me: ${errorInput}`;
      throw errorMessage;
    }

    const mode = opts.mode || parseInt('777', 8) & 0xfff;
    const mtime = opts.mtime || Math.floor(Number(new Date()) / 1000);
    const uid = opts.uid || 0;
    const gid = opts.gid || 0;

    const data = {
      fileName: filepath,
      fileMode: utils.pad(mode, 7),
      uid: utils.pad(uid, 7),
      gid: utils.pad(gid, 7),
      fileSize: utils.pad(input.length, 11),
      mtime: utils.pad(mtime, 11),
      checksum: '        ',
      // 0 = just a file
      type: '0',
      ustar: 'ustar  ',
      owner: opts.owner || '',
      group: opts.group || ''
    };

    // calculate the checksum
    checksum = 0;
    Object.keys(data).forEach(key => {
      let i: number;
      const value = data[key];
      let length: number;

      for (i = 0, length = value.length; i < length; i += 1) {
        checksum += value.charCodeAt(i);
      }
    });

    data.checksum = `${utils.pad(checksum, 6)}\u0000 `;

    const headerArr = header.format(data);

    const headerLength = Math.ceil(headerArr.length / recordSize) * recordSize;
    const inputLength = Math.ceil(input.length / recordSize) * recordSize;

    this.blocks.push({
      header: headerArr,
      input,
      headerLength,
      inputLength
    });
  }

  save() {
    const buffers: Uint8Array[] = [];
    const chunks: {blocks: Block[]; length: number}[] = [];
    let length = 0;
    const max = Math.pow(2, 20);

    let chunk: Block[] = [];
    this.blocks.forEach(b => {
      if (length + b.headerLength + b.inputLength > max) {
        chunks.push({blocks: chunk, length});
        chunk = [];
        length = 0;
      }
      chunk.push(b);
      length += b.headerLength + b.inputLength;
    });
    chunks.push({blocks: chunk, length});

    chunks.forEach(c => {
      const buffer = new Uint8Array(c.length);
      let written = 0;
      c.blocks.forEach(b => {
        buffer.set(b.header, written);
        written += b.headerLength;
        buffer.set(b.input, written);
        written += b.inputLength;
      });
      buffers.push(buffer);
    });

    buffers.push(new Uint8Array(2 * recordSize));

    return new Blob(buffers, {type: 'octet/stream'});
  }

  clear() {
    this.written = 0;
    this.out = utils.clean(blockSize);
  }
}

export default Tar;
