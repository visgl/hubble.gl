// Copyright (c) 2020 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-disable no-console */
/* global console, Blob, atob */
/**
 * @param {number} n
 */
export function pad(n) {
  return String(`0000000${n}`).slice(-7);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} type
 * @param {number} quality
 */
export function getBase64(canvas, type, quality) {
  return canvas.toDataURL(type, quality).split(',')[1];
}

/**
 * @param {string} b64
 */
export function checkIfBlank(b64) {
  if (b64.length < 100000) {
    console.error('SMALL IMAGE!', b64, b64.length);
    return true;
  }
  return false;
}

/**
 * @param {string} base64
 * @param {string} type
 */
export function getBlob(base64, type) {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], {type});
}
