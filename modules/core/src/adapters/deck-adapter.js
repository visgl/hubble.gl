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
import HubbleGl from '../hubblegl';
import {PreviewEncoder} from '../encoders';
// eslint-disable-next-line no-unused-vars
import {DeckScene} from '../scene';
import {VideoCapture} from '../capture/video-capture';

export default class DeckAdapter {
  /** @type {HubbleGl} */
  hubblegl;
  /** @type {DeckScene} */
  scene;
  /** @type {(animationLoop: any) => Promise<DeckScene> | DeckScene} */
  sceneBuilder;
  /** @type {import('../encoders').FrameEncoder} */
  encoder;
  shouldAnimate;

  af;

  constructor(sceneBuilder, Encoder = PreviewEncoder, encoderSettings = {}) {
    this.sceneBuilder = sceneBuilder;
    this.encoderSettings = encoderSettings;
    this.encoder = new Encoder(encoderSettings);
    this.shouldAnimate = true;
    this.getProps = this.getProps.bind(this);
    this.render = this.render.bind(this);
    this.preview = this.preview.bind(this);
    this.stop = this.stop.bind(this);
    this.setEncoder = this.setEncoder.bind(this);
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

  /**
   * TODO: see if this can be removed once setEncoder works.
   * @param {() => void} onNextFrame
   */
  update(onNextFrame) {
    if (this.af) {
      cancelAnimationFrame(this.af);
    }
    this.af = requestAnimationFrame(() => onNextFrame());
  }

  render(startTimeMs) {
    this.shouldAnimate = true;
    this.hubblegl.start(startTimeMs);
  }

  preview() {
    this.scene.animationLoop.timeline.play();
  }

  /**
   * @param {() => void} callback
   */
  stop(callback) {
    this.shouldAnimate = false;
    this.hubblegl.stop(callback);
  }

  setEncoder(Encoder, encoderSettings = undefined) {
    this.shouldAnimate = false;
    if (!encoderSettings) {
      encoderSettings = this.encoderSettings;
    }
    this.encoder = new Encoder(encoderSettings);
    this.hubblegl.setRecorder(VideoCapture.withEncoder(this.hubblegl.recorder, this.encoder));
    // TODO: setEncoder is WIP
    // this.hubblegl = new HubbleGl({
    //   deck: this.deck,
    //   recordingLengthMs: this.scene.length,
    //   encoder: this.encoder
    // });
  }

  async _deckOnLoad(deck) {
    this.deck = deck;
    const animationLoop = deck.animationLoop;
    animationLoop.attachTimeline(new Timeline());
    animationLoop.timeline.setTime(0);

    await Promise.resolve(this.sceneBuilder(animationLoop)).then(scene => {
      this._applyScene(deck, scene);
    });
  }

  _applyScene(deck, scene) {
    this.scene = scene;
    this.encoder = new this.Encoder(this.encoderSettings);
    this.hubblegl = new HubbleGl({
      deck,
      recordingLengthMs: this.scene.length,
      encoder: this.encoder
    });
  }

  _getViewState() {
    if (!this.hubblegl || !this.scene) {
      return null;
    }
    const frame = this.scene.keyframes.camera.getFrame();
    console.log('camera-state');
    return frame;
  }

  _getLayers() {
    if (!this.hubblegl || !this.scene) {
      return [];
    }
    return this.scene.renderLayers();
  }

  /**
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  _onAfterRender(proceedToNextFrame) {
    if (this.hubblegl) {
      console.log('after render');
      this.hubblegl.capture(proceedToNextFrame);
    }
  }
}
