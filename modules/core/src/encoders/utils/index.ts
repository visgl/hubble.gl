// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* global fetch */

export function pad(n: number) {
  return String(`0000000${n}`).slice(-7);
}

export async function canvasToArrayBuffer(canvas: HTMLCanvasElement, type: string, quality?: number) {
  const base64 = canvas.toDataURL(type, quality);
  const response = await fetch(base64);
  return await response.arrayBuffer();
}

export function checkIfBlank(b64: string) {
  if (b64.length < 100000) {
    console.warn('Possibly blank image!', b64, b64.length);
    return true;
  }
  return false;
}
