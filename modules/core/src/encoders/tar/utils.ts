// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

const lookup = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '/'
];
export function clean(length: number) {
  let i: number;
  const buffer = new Uint8Array(length);
  for (i = 0; i < length; i += 1) {
    buffer[i] = 0;
  }
  return buffer;
}

export function extend(orig: any, length: number, addLength: number, multipleOf: number) {
  const newSize = length + addLength;
  const buffer = clean((Math.floor(newSize / multipleOf) + 1) * multipleOf);

  buffer.set(orig);

  return buffer;
}

export function pad(num: number, bytes: number, base = 8) {
  const numStr = num.toString(base);
  return '000000000000'.substr(numStr.length + 12 - bytes) + num;
}

export function stringToUint8(input: string, out?: Uint8Array, offset: number = 0) {
  let i: number;
  let length: number;

  out = out || clean(input.length);

  for (i = 0, length = input.length; i < length; i += 1) {
    out[offset] = input.charCodeAt(i);
    offset += 1;
  }

  return out;
}

export function uint8ToBase64(uint8: Uint8Array) {
  let i: number;
  // if we have 1 byte left, pad 2 bytes
  const extraBytes = uint8.length % 3;
  let output = '';
  let temp: number;
  let length: number;

  function tripletToBase64(num) {
    return (
      lookup[(num >> 18) & 0x3f] +
      lookup[(num >> 12) & 0x3f] +
      lookup[(num >> 6) & 0x3f] +
      lookup[num & 0x3f]
    );
  }

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
    temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output += tripletToBase64(temp);
  }

  // this prevents an ERR_INVALID_URL in Chrome (Firefox okay)
  switch (output.length % 4) {
    case 1:
      output += '=';
      break;
    case 2:
      output += '==';
      break;
    default:
      break;
  }

  return output;
}
