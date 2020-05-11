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
import {VideoCapture} from './capture/video-capture';

export default class HubbleGl {
  /** @type {VideoCapture} */
  recorder;
  /** @type import('types').DeckGl */
  deck;
  capturing = false;

  /**
   * @param {import('types').HubbleGlSettings} settings
   */
  constructor({deck, recordingLengthMs, encoder}) {
    this.deck = deck;
    this.recorder = new VideoCapture(encoder, recordingLengthMs);
    this.capture = this.capture.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.setRecorder = this.setRecorder.bind(this);
  }

  setRecorder(recorder) {
    this.recorder = recorder;
  }

  start(startTimeMs = 0) {
    if (!this.recorder.isRecording()) {
      this.deck.animationLoop.timeline.setTime(startTimeMs);
      // UNCOMMENT TO ENABLE RECORDING
      this.recorder.start(startTimeMs);
    }
  }

  stop(callback) {
    if (this.recorder.isRecording()) {
      this.recorder.stop(callback);
    }
  }

  /**
   * Try to capture the current canvas
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  capture(proceedToNextFrame) {
    console.log(`outside-hubble-capture ${this.capturing} ${this.recorder.isRecording()}`);

    if (!this.capturing && this.recorder.isRecording()) {
      console.log('hubble-capture');

      this.capturing = true;
      // capture current canvas, i.e.
      // const can = document.getElementsByClassName('mapboxgl-canvas')[0];
      // const can = document.getElementById('default-deckgl-overlay');
      this.recorder.capture(this.deck.canvas).then(data => {
        this.capturing = false;
        if (data.kind === 'step') {
          console.log(`data.nextTimeMs === ${data.nextTimeMs}`);
          this.deck.animationLoop.timeline.setTime(data.nextTimeMs);
          proceedToNextFrame(data.nextTimeMs);
        } else if (data.error === 'STOP') {
          console.log('data.error === STOP');
          this.stop();
        } else {
          console.log(data);
        }
      });
    }
  }
}
