// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable no-console */
import download from 'downloadjs';
import type {FrameEncoder, FormatConfigs} from '../encoders';
import {guid} from './utils';

type Timecode = {start: number, end: number, duration: number, framerate: number}

type CaptureStepSuccess = {
  kind: 'next-frame'
  nextTimeMs: number
}

type CaptureStepStop = {
  kind: 'stop'
}

type CaptureStepError = {
  kind: 'error'
  error: 'NOT_RECORDING' | string
}

type CaptureStep = CaptureStepSuccess | CaptureStepError | CaptureStepStop

export class VideoCapture {
  /** True if recording new canvas frames, false when saving, idle, etc. */
  recording: boolean = false;
  /** True when working on a image frame capture. */
  capturing: boolean = false;
  timeMs: number = 0;
  timecode: Timecode | null;
  encoder: FrameEncoder | null;
  filename: string | null;
  onStop: () => void | null = null;

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

  isRecording(): boolean {
    return this.recording;
  }

  /**
   * Start recording.
   */
  render({
    Encoder, 
    formatConfigs, 
    timecode, 
    filename = undefined, 
    onStop = undefined
  }: {
    Encoder: typeof FrameEncoder, 
    formatConfigs: FormatConfigs,
    timecode: Timecode,
    filename?: string,
    onStop?: () => void
  }) {
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
   */
  capture(canvas: HTMLCanvasElement, proceedToNextFrame: (nextTimeMs: number) => void) {
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
   */
  stop({
    onComplete = undefined, 
    onSave = undefined, 
    onStopped = undefined, 
    abort = false
  }: {
    onComplete?: () => void,
    onSave?: (blob: Blob) => void,
    onStopped?: () => void,
    abort?: boolean
  }) {
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

  download(blob: Blob) {
    if (blob) {
      download(blob, this.filename + this.encoder.extension, this.encoder.mimeType);
    }
    return false;
  }

  async _save(callback: (blob: Blob) => void) {
    if (!callback) {
      callback = this.download;
    }
    console.time('save');
    await this.encoder
      .save()
      .then(callback)
      .then(() => console.timeEnd('save'));
  }

  _sanitizeFilename(filename: string) {
    if (!filename) {
      filename = guid();
    }
    return filename;
  }

  _sanatizeTimecode(timecode: Timecode) {
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
   */
  async _capture(canvas: HTMLCanvasElement): Promise<CaptureStep> {
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

  _step(): CaptureStep {
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
