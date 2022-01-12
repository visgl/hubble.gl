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
/* eslint-disable no-console */
import download from 'downloadjs';
// eslint-disable-next-line no-unused-vars
import {FrameEncoder} from '../encoders';
import {guid} from './utils';

export class VideoCapture {
  /** @type {boolean} - True if recording new canvas frames, false when saving, idle, etc. */
  recording;
  /** @type {boolean} - True when working on a image frame capture. */
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
    this.timecode = null;
    this.encoder = null;
    this.filename = null;

    this._getNextTimeMs = this._getNextTimeMs.bind(this);
    this._step = this._step.bind(this);
    this._capture = this._capture.bind(this);
    this.capture = this.capture.bind(this);
    this.render = this.render.bind(this);
    this.download = this.download.bind(this);
    this.stop = this.stop.bind(this);
    this._save = this._save.bind(this);
  }

  isRecording() {
    return this.recording;
  }

  /**
   * Start recording.
   * @param {Object} params
   * @param {typeof FrameEncoder} params.Encoder
   * @param {import('types').FormatConfigs} params.formatConfigs
   * @param {{start: number, end: number, framerate: number, duration?: number}} params.timecode
   * @param {() => void} params.onStop
   */
  render({Encoder, formatConfigs, timecode, filename = undefined, onStop = undefined}) {
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
    if (!this.capturing && this.isRecording()) {
      this.capturing = true;
      // capture canvas
      this._capture(canvas).then(data => {
        this.capturing = false;
        if (data.kind === 'next-frame') {
          proceedToNextFrame(data.nextTimeMs);
        } else if (data.kind === 'stop') {
          this.onStop();
        } else {
          console.log(data);
        }
      });
    }
  }

  /**
   * Stop and save recording. Execute onComplete when finished.
   * @param {Object} params
   * @param {() => void} params.onStopped
   * @param {(blob: Blob) => void} params.onSave
   * @param {() => void} params.onComplete
   * @param {boolean} [params.abort]
   */
  stop({onComplete = undefined, onSave = undefined, onStopped = undefined, abort = false}) {
    if (this.isRecording()) {
      console.log(`Stopped recording. Recorded for ${this.timeMs}ms.`);
      this.recording = false;
      this.capturing = false;
      if (onStopped) {
        onStopped();
      }
      console.timeEnd('render');
      const finish = () => {
        if (onComplete) {
          // eslint-disable-next-line callback-return
          onComplete();
        }
        this.timecode = null;
        this.onStop = undefined;
      };
      if (!abort) {
        this._save(onSave).then(finish);
      }
      finish();
    }
  }

  /**
   * @param {Blob} blob
   */

  download(blob) {
    if (blob) {
      download(blob, this.filename + this.encoder.extension, this.encoder.mimeType);
    }
    return false;
  }

  /**
   * @param { (blob: Blob) => void } callback
   */
  async _save(callback) {
    if (!callback) {
      callback = this.download;
    }
    console.time('save');
    await this.encoder
      .save()
      .then(callback)
      .then(() => console.timeEnd('save'));
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
    const nextTimeMs = this._getNextTimeMs();
    if (nextTimeMs > this.timecode.end) {
      return {kind: 'stop'};
    }
    this.timeMs = nextTimeMs;
    return {kind: 'next-frame', nextTimeMs};
  }

  // Get next time MS based on current time MS and framerate
  // @return time in milliseconds for next frame.
  _getNextTimeMs() {
    const frameLengthMs = Math.floor(1000.0 / this.timecode.framerate);
    return this.timeMs + frameLengthMs;
  }
}
