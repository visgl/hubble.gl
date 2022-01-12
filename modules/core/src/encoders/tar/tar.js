// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import * as utils from './utils';
import * as header from './header';

let blockSize;
const recordSize = 512;

class Tar {
  /** @type {{ header: any; input: string | Uint8Array; headerLength: number; inputLength: number; }[]} */
  blocks;
  /**
   * @param {number} [recordsPerBlock]
   */
  constructor(recordsPerBlock) {
    this.written = 0;
    blockSize = (recordsPerBlock || 20) * recordSize;
    this.out = utils.clean(blockSize);
    this.blocks = [];
    this.length = 0;
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.append = this.append.bind(this);
  }

  /**
   * @param {string} filepath
   * @param {string | Uint8Array} input
   * @param {{ mode?: any; mtime?: any; uid?: any; gid?: any; owner?: any; group?: any; }} [opts]
   */
  append(filepath, input, opts) {
    let checksum;

    if (typeof input === 'string') {
      input = utils.stringToUint8(input);
    } else if (input.constructor !== Uint8Array.prototype.constructor) {
      const errorInput = input.constructor
        .toString()
        .match(/function\s*([$A-Za-z_][0-9A-Za-z_]*)\s*\(/)[1];
      const errorMessage = `Invalid input type. You gave me: ${errorInput}`;
      throw errorMessage;
    }

    opts = opts || {};

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
      let i;
      const value = data[key];
      let length;

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
    const buffers = [];
    const chunks = [];
    let length = 0;
    const max = Math.pow(2, 20);

    let chunk = [];
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
