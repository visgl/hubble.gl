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
/*
struct posix_header {             // byte offset
	char name[100];               //   0
	char mode[8];                 // 100
	char uid[8];                  // 108
	char gid[8];                  // 116
	char size[12];                // 124
	char mtime[12];               // 136
	char chksum[8];               // 148
	char typeflag;                // 156
	char linkname[100];           // 157
	char magic[6];                // 257
	char version[2];              // 263
	char uname[32];               // 265
	char gname[32];               // 297
	char devmajor[8];             // 329
	char devminor[8];             // 337
	char prefix[155];             // 345
                                  // 500
};
*/

export const structure = [
  {
    field: 'fileName',
    length: 100
  },
  {
    field: 'fileMode',
    length: 8
  },
  {
    field: 'uid',
    length: 8
  },
  {
    field: 'gid',
    length: 8
  },
  {
    field: 'fileSize',
    length: 12
  },
  {
    field: 'mtime',
    length: 12
  },
  {
    field: 'checksum',
    length: 8
  },
  {
    field: 'type',
    length: 1
  },
  {
    field: 'linkName',
    length: 100
  },
  {
    field: 'ustar',
    length: 8
  },
  {
    field: 'owner',
    length: 32
  },
  {
    field: 'group',
    length: 32
  },
  {
    field: 'majorNumber',
    length: 8
  },
  {
    field: 'minorNumber',
    length: 8
  },
  {
    field: 'filenamePrefix',
    length: 155
  },
  {
    field: 'padding',
    length: 12
  }
];

export function format(data, cb) {
  const buffer = utils.clean(512);
  let offset = 0;

  structure.forEach(value => {
    const str = data[value.field] || '';
    let i;
    let length;

    for (i = 0, length = str.length; i < length; i += 1) {
      buffer[offset] = str.charCodeAt(i);
      offset += 1;
    }

    // space it out with nulls
    offset += value.length - i;
  });

  if (typeof cb === 'function') {
    return cb(buffer, offset);
  }
  return buffer;
}
