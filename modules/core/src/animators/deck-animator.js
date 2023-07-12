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
import {PreviewEncoder} from '../encoders';
// eslint-disable-next-line no-unused-vars
import {AnimationManager} from '../animations';
import {VideoCapture} from '../capture/video-capture';

export default class DeckAnimator {
  /** @type {any} */
  deck;
  /** @type {AnimationManager} */
  animationManager;
  /** @type {boolean} */
  shouldAnimate;
  /** @type {boolean} */
  enabled;
  /** @type {WebGL2RenderingContext} */
  glContext;

  /**
   * @param {Object} params
   * @param {any} params.deck
   * @param {any[]} params.animations
   * @param {WebGL2RenderingContext} params.glContext
   */
  constructor({deck = undefined, animations = undefined, glContext = undefined}) {
    this.animationManager = new AnimationManager({animations});
    this.glContext = glContext;
    this.videoCapture = new VideoCapture();
    this.shouldAnimate = false;
    this.enabled = false;
    this.getProps = this.getProps.bind(this);
    this.setDeckProps = this.setDeckProps.bind(this);
    this.setDeck = this.setDeck.bind(this);
    this.render = this.render.bind(this);
    this.stop = this.stop.bind(this);
    this.seek = this.seek.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
    this.setDeck(deck);
  }

  setDeck(deck) {
    this.deck = deck;
    this.setDeckProps();
  }

  /**
   * @param {Object} params
   * @param {any?} params.deck
   * @param {(nextTimeMs: number) => void} params.onNextFrame
   * @param {Object} params.extraProps
   */
  getProps({deck, onNextFrame = undefined, extraProps = undefined}) {
    if (deck) {
      this.deck = deck;
    }
    const props = {
      _animate: this.shouldAnimate
    };

    if (onNextFrame) {
      props.onAfterRender = () => this.onAfterRender(onNextFrame);
    }

    if (this.enabled) {
      props.controller = false;
    } else {
      props.controller = true;
    }

    if (this.glContext) {
      props.gl = this.glContext;
    }
    return {...extraProps, ...props};
  }

  setDeckProps() {
    this.deck.setProps(
      this.getProps({
        onNextFrame: this.setDeckProps // draw loop
      })
    );
  }

  /**
   * @param {Object} params
   * @param {import('../encoders').FrameEncoder} params.encoder
   * @param {string} params.filename
   * @param {{start: number, end: number, framerate: number}} params.timecode
   * @param {() => void} params.onStopped
   * @param {(blob: Blob) => void} params.onSave
   * @param {() => void} params.onComplete
   */
  render({
    encoder = new PreviewEncoder(),
    filename = undefined,
    timecode = {start: 0, end: 0, framerate: 30},
    onStopped = undefined,
    onSave = undefined,
    onComplete = undefined
  }) {
    this.shouldAnimate = true;
    this.videoCapture.render({
      encoder,
      timecode,
      filename,
      onStop: () => this.stop({onStopped, onSave, onComplete})
    });
    this.enabled = true;
    this.seek(timecode.start);
  }

  /**
   * @param {Object} params
   * @param {() => void} params.onStopped
   * @param {(blob: Blob) => void} params.onSave
   * @param {() => void} params.onComplete
   * @param {boolean} [params.abort]
   */
  stop({onStopped, onSave, onComplete, abort}) {
    this.enabled = false;
    this.shouldAnimate = false;
    this.videoCapture.stop({onStopped, onSave, onComplete, abort});
  }

  /**
   * @param {number} timeMs
   */
  seek(timeMs) {
    this.animationManager.timeline.setTime(timeMs);
    this.animationManager.draw();
  }

  /**
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   * @param {boolean} readyToCapture
   */
  onAfterRender(proceedToNextFrame, readyToCapture = true) {
    const areAllLayersLoaded = this.deck && this.deck.props.layers.every(layer => layer.isLoaded);
    if (this.videoCapture.isRecording() && areAllLayersLoaded && readyToCapture) {
      this.videoCapture.capture(this.deck.canvas, nextTimeMs => {
        this.seek(nextTimeMs);
        proceedToNextFrame(nextTimeMs);
      });
    }
  }
}
