// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {FrameEncoderSettings} from '../frame-encoder';
import FrameEncoder from '../frame-encoder';

/*
  HTMLCanvasElement.captureStream()
*/
class StreamEncoder extends FrameEncoder {
  stream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  chunks: Blob[];

  constructor(settings: FrameEncoderSettings) {
    super(settings);
    this.mimeType = 'video/webm';
    this.extension = '.webm';
    this.chunks = [];
    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
  }

  start() {
    this.stream = null;
    this.mediaRecorder = null;
    this.chunks = [];
  }

  async add(canvas: HTMLCanvasElement) {
    if (!this.stream) {
      this.stream = canvas.captureStream(this.framerate);
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.start();

      this.mediaRecorder.ondataavailable = e => {
        this.chunks.push(e.data);
      };
    }
    return Promise.resolve();
  }

  async save() {
    const waiting = new Promise<Blob>(resolve => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, {type: 'video/webm'});
          this.chunks = [];
          resolve(blob);
        };
        this.mediaRecorder.stop();
      }
    });

    return waiting;
  }
}

export default StreamEncoder;
