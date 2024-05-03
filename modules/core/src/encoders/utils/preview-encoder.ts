// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
/* global requestAnimationFrame, cancelAnimationFrame */
import FrameEncoder from '../frame-encoder';
export default class PreviewEncoder extends FrameEncoder {
  af?: number;
  start() {
    if (this.af) {
      cancelAnimationFrame(this.af);
    }
  }
  async add(canvas: HTMLCanvasElement) {
    const animationFrame = new Promise<void>(resolve => {
      if (this.af) {
        cancelAnimationFrame(this.af);
      }
      this.af = requestAnimationFrame(() => resolve());
    });
    return animationFrame;
  }
  async save() {
    if (this.af) {
      cancelAnimationFrame(this.af);
    }
    return await Promise.resolve(null);
  }
}
