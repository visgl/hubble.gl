// Copyright (c) 2020 Uber Technologies, Inc.
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
/* eslint-disable no-console */
/* global console */
import download from 'downloadjs';
// eslint-disable-next-line no-unused-vars
import {FrameEncoder} from '../encoders';
import {guid} from './utils';

export class VideoCapture {
  /** @type {number} */
  recordingLengthMs;
  /** @type {boolean} */
  recording;
  /** @type {number} */
  timeMs;
  /** @type {number} */
  framerate;
  /** @type {FrameEncoder} */
  encoder;
  /** @type {string} */
  filename;

  /**
   * @param {FrameEncoder} encoder
   * @param {number} recordingLengthMs
   */
  constructor(encoder, recordingLengthMs) {
    this.setRecordingLengthMs(recordingLengthMs);
    this.recording = false;
    this.timeMs = 0;
    this.encoder = encoder;

    this._getNextTimeMs = this._getNextTimeMs.bind(this);
    this._step = this._step.bind(this);
    this.capture = this.capture.bind(this);
  }

  setRecordingLengthMs(recordingLengthMs) {
    if (recordingLengthMs <= 0) {
      throw new Error(
        `Invalid recording length in ms (${recordingLengthMs}).  Must be greater than 0.`
      );
    }
    this.recordingLengthMs = recordingLengthMs;
  }

  setEncoder(encoder) {
    // this.encoder.dispose(); TODO: Should we dispose?
    this.encoder = encoder;
  }

  // True if recording, false otherwise.
  isRecording() {
    return this.recording;
  }
  /**
   * @returns {import('types').CaptureStep}
   */
  _step() {
    // generating next frame timestamp
    this.timeMs = this._getNextTimeMs();
    if (this.timeMs > this.recordingLengthMs) {
      return {kind: 'error', error: 'STOP'};
    }
    return {kind: 'step', nextTimeMs: this.timeMs};
  }

  // Get next time MS based on current time MS and framerate
  // @return time in milliseconds for next frame.
  _getNextTimeMs() {
    const frameLengthMs = parseInt(1000.0 / this.encoder.framerate, 10);
    return this.timeMs + frameLengthMs;
  }

  // Start recording.  Pass in lengthMs of recording and on-stop callback.
  start(startTimeMs = 0, filename = undefined) {
    console.log(`Starting recording for ${this.recordingLengthMs}ms.`);
    this.filename = filename || guid();
    this.timeMs = startTimeMs;
    this.encoder.start();
    this.recording = true;
  }

  /**
   * Capture the current canvas.
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<import('types').CaptureStep>}
   */
  async capture(canvas) {
    if (!this.isRecording()) {
      return {kind: 'error', error: 'NOT_RECORDING'};
    }
    // getting blob from canvas
    return await this.encoder
      .add(canvas)
      .then(this._step)
      .catch(reason => ({kind: 'error', error: reason}));
  }

  /**
   * Stop and save recording. Execute callback if provided.
   * @param {() => void} callback
   */
  stop(callback) {
    console.log(`Stopping recording.  Recorded for ${this.recordingLengthMs}ms.`);
    this.recording = false;
    this.save();

    if (callback) {
      // eslint-disable-next-line callback-return
      callback();
    }
  }

  /**
   * @param {{ (blob: Blob): boolean }} [callback]
   */
  save(callback) {
    if (!callback) {
      /**
       * @param {Blob} blob
       */
      callback = blob => {
        if (blob) {
          download(blob, this.filename + this.encoder.extension, this.encoder.mimeType);
        }
        return false;
      };
    }
    this.encoder.save().then(callback);
  }
}

// NOTES
// let success = this.capture(canvas);
// if (!success) {
//   setTimeout(() => {
//     let success = this.capture(canvas);
//     console.log('Retry!', success);
//   }, 2000);
// }
// let tries = 0;
// while (!success && tries < 3) {
//   console.log('Retry!');
//   success = this.capture(canvas);
//   tries++;
// }
