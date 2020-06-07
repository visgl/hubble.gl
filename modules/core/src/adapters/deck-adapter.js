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
import {Timeline} from '@luma.gl/engine';
import {PreviewEncoder} from '../encoders';
// eslint-disable-next-line no-unused-vars
import {DeckScene} from '../scene';
import {VideoCapture} from '../capture/video-capture';

export default class DeckAdapter {
  /** @type {DeckScene} */
  scene;
  /** @type {(animationLoop: any) => Promise<DeckScene> | DeckScene} */
  sceneBuilder;
  /** @type {boolean} */
  shouldAnimate;

  constructor(sceneBuilder) {
    this.sceneBuilder = sceneBuilder;
    this.videoCapture = new VideoCapture();

    this.shouldAnimate = true;
    this.getProps = this.getProps.bind(this);
    this.render = this.render.bind(this);
    this.preview = this.preview.bind(this);
    this.stop = this.stop.bind(this);
    this._deckOnLoad = this._deckOnLoad.bind(this);
    this._getViewState = this._getViewState.bind(this);
    this._getLayers = this._getLayers.bind(this);
    this._applyScene = this._applyScene.bind(this);
  }

  /**
   * @param {{ current: { deck: any; }; }} deckRef
   * @param {(ready: boolean) => void} setReady
   * @param {(nextTimeMs: number) => void} onNextFrame
   */
  getProps(deckRef, setReady, onNextFrame) {
    return {
      viewState: this._getViewState(),
      layers: this._getLayers(),
      onAfterRender: () => this._onAfterRender(onNextFrame),
      onLoad: () =>
        this._deckOnLoad(deckRef.current.deck).then(() => {
          // console.log('adapter')
          setReady(true);
        }),
      _animate: this.shouldAnimate
    };
  }

  render(Encoder = PreviewEncoder, encoderSettings = {}, onStop = undefined) {
    this.shouldAnimate = true;

    if (!encoderSettings.animationLengthMs) {
      encoderSettings.animationLengthMs = this.scene.length;
    }

    this.videoCapture.render(Encoder, encoderSettings, onStop);
    this.scene.animationLoop.timeline.setTime(encoderSettings.startOffsetMs);
  }

  preview() {
    this.scene.animationLoop.timeline.play();
  }

  /**
   * @param {() => void} callback
   */
  stop(callback) {
    this.shouldAnimate = false;
    this.videoCapture.stop(callback);
  }

  async _deckOnLoad(deck) {
    this.deck = deck;
    const animationLoop = deck.animationLoop;
    animationLoop.attachTimeline(new Timeline());
    animationLoop.timeline.setTime(0);

    await Promise.resolve(this.sceneBuilder(animationLoop)).then(scene => {
      this._applyScene(scene);
    });
  }

  // TODO: allow user to change scenes at runtime.
  _applyScene(scene) {
    this.scene = scene;
  }

  _getViewState() {
    if (!this.videoCapture || !this.scene) {
      return null;
    }
    const frame = this.scene.keyframes.camera.getFrame();
    // console.log('camera-state');
    return frame;
  }

  _getLayers() {
    if (!this.videoCapture || !this.scene) {
      return [];
    }
    return this.scene.renderLayers();
  }

  /**
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  _onAfterRender(proceedToNextFrame) {
    if (this.videoCapture) {
      // console.log('after render');
      this.videoCapture.capture(this.deck.canvas, nextTimeMs => {
        this.scene.animationLoop.timeline.setTime(nextTimeMs);
        proceedToNextFrame(nextTimeMs);
      });
    }
  }
}
