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
  /** @type {boolean} */
  recording;
  /** @type {boolean} */
  capturing;
  /** @type {number} */
  timeMs;
  /** @type {{start: number, end: number, duration: number, framerate: number}} */
  timecode;
  /** @type {FrameEncoder} */
  encoder;
  /** @type {string} */
  filename;

  constructor() {
    this.recording = false;
    this.capturing = false;
    this.timeMs = 0;
    this.encoder = null;

    this._getNextTimeMs = this._getNextTimeMs.bind(this);
    this._step = this._step.bind(this);
    this._capture = this._capture.bind(this);
    this.capture = this.capture.bind(this);
    this.render = this.render.bind(this);
    this.stop = this.stop.bind(this);
    this.save = this.save.bind(this);
  }

  // True if recording, false otherwise.
  isRecording() {
    return this.recording;
  }

  /**
   * Start recording.
   * @param {typeof FrameEncoder} Encoder
   * @param {import('types').FormatConfigs} formatConfigs
   * @param {{start: number, end: number, framerate: number, duration?: number}} timecode
   * @param {() => void} onStop
   */
  render(Encoder, formatConfigs, timecode, filename = undefined, onStop = undefined) {
    if (!this.isRecording()) {
      console.time('render');
      this.filename = this._sanitizeFilename(filename);
      this.timecode = this._sanatizeTimecode(timecode);
      console.log(`Starting recording for ${this.timecode.duration}ms.`);
      this.onStop = onStop;
      this.encoder = new Encoder({...formatConfigs, framerate: this.timecode.framerate});
      this.recording = true;
      this.encoder.start();
    }
  }

  /**
   * Capture a frame of the canvas.
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  capture(canvas, proceedToNextFrame) {
    // console.log(`outside-hubble-capture ${this.capturing} ${this.isRecording()}`);

    if (!this.capturing && this.isRecording()) {
      // console.log('hubble-capture');

      this.capturing = true;
      // capture current canvas, i.e.
      // const can = document.getElementsByClassName('mapboxgl-canvas')[0];
      // const can = document.getElementById('default-deckgl-overlay');
      this._capture(canvas).then(data => {
        this.capturing = false;
        if (data.kind === 'step') {
          // console.log(`data.nextTimeMs: ${data.nextTimeMs}`);
          proceedToNextFrame(data.nextTimeMs);
        } else if (data.error === 'STOP') {
          console.log('data.error: STOP');
          this.stop(this.onStop);
        } else {
          console.log(data);
        }
      });
    }
  }

  /**
   * Stop and save recording. Execute callback if provided.
   * @param {() => void} callback
   */
  stop(callback = undefined) {
    if (this.isRecording()) {
      console.log(`Stopping recording.  Recorded for ${this.timecode.duration}ms.`);
      this.recording = false;
      this.capturing = false; // Added to fix an intermittent bug
      this.save().then(() => {
        if (callback) {
          // eslint-disable-next-line callback-return
          callback();
          this.timecode = null;
        }
      });
    }
  }

  /**
   * @param {{ (blob: Blob): boolean }} [callback]
   */
  async save(callback) {
    console.timeEnd('render');
    if (!callback) {
      /**
       * @param {Blob} blob
       */
      callback = blob => {
        console.timeEnd('save');
        if (blob) {
          download(blob, this.filename + this.encoder.extension, this.encoder.mimeType);
        }
        return false;
      };
    }
    console.time('save');
    await this.encoder.save().then(callback);
  }

  /**
   * @param {string} filename
   */
  _sanitizeFilename(filename) {
    if (!filename) {
      filename = guid();
    }
    return filename;
  }

  /**
   * @param {{start: number, end: number, framerate: number, duration?: number}} timecode
   */
  _sanatizeTimecode(timecode) {
    const parsedTimecode = {
      duration: undefined,
      ...timecode
    };

    if (!parsedTimecode.start) {
      parsedTimecode.start = 0;
    }
    this.timeMs = parsedTimecode.start;

    if (!parsedTimecode.duration) {
      parsedTimecode.duration = parsedTimecode.end - parsedTimecode.start;
    }

    if (parsedTimecode.duration <= 0) {
      throw new Error(
        `Invalid recording length (${parsedTimecode.duration}ms).  Must be greater than 0.`
      );
    }
    return parsedTimecode;
  }

  /**
   * Capture the current canvas.
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<import('types').CaptureStep>}
   */
  async _capture(canvas) {
    // console.log('video-capture');
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
   * @returns {import('types').CaptureStep}
   */
  _step() {
    // generating next frame timestamp
    this.timeMs = this._getNextTimeMs();
    if (this.timeMs > this.timecode.end) {
      return {kind: 'error', error: 'STOP'};
    }
    return {kind: 'step', nextTimeMs: this.timeMs};
  }

  // Get next time MS based on current time MS and framerate
  // @return time in milliseconds for next frame.
  _getNextTimeMs() {
    const frameLengthMs = Math.floor(1000.0 / this.timecode.framerate);
    return this.timeMs + frameLengthMs;
  }
}
