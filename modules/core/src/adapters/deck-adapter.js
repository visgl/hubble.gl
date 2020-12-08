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
  /** @type {boolean} */
  enabled;
  /** @type {WebGL2RenderingContext} */
  glContext;

  /**
   * @param {(animationLoop: any) => DeckScene | Promise<DeckScene>} sceneBuilder
   * @param {WebGL2RenderingContext} glContext
   */
  constructor(sceneBuilder, glContext = undefined) {
    this.sceneBuilder = sceneBuilder;
    this.glContext = glContext;
    this.videoCapture = new VideoCapture();
    this.shouldAnimate = true;
    this.enabled = false;
    this.getProps = this.getProps.bind(this);
    this.render = this.render.bind(this);
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
  getProps(deckRef, setReady, onNextFrame = undefined) {
    const props = {
      onLoad: () =>
        this._deckOnLoad(deckRef.current.deck).then(() => {
          setReady(true);
        }),
      _animate: this.shouldAnimate
    };

    if (onNextFrame) {
      // Remove the underscore to make it public? Please verify
      props.onAfterRender = () => this.onAfterRender(onNextFrame);
    }

    // Animating the camera is optional, but if a keyframe is defined then viewState is controlled by camera keyframe.
    if (this.scene && this.scene.keyframes.camera && this.enabled) {
      props.controller = false;
      props.viewState = this._getViewState();
    }

    // Only replace layers when use defines scene layers
    // TODO: Could potentially concat instead of replace, but layers are supposed to be static.
    if (this.scene && this.scene.hasLayers()) {
      props.layers = this._getLayers();
    }

    if (this.scene) {
      props.width = this.scene.width;
      props.height = this.scene.height;
    }

    if (this.glContext) {
      props.gl = this.glContext;
    }
    return props;
  }

  /**
   * @param {typeof import('../encoders').FrameEncoder} Encoder
   * @param {import('types').FrameEncoderSettings} encoderSettings
   * @param {() => void} onStop
   * @param {(prevCamera: import('../keyframes').CameraKeyframes) => void} updateCamera
   */
  render(
    Encoder = PreviewEncoder,
    encoderSettings = {},
    onStop = undefined,
    updateCamera = undefined
  ) {
    if (updateCamera) {
      // Optional camera and keyframes defined by the user at runtime
      this.scene.animationLoop.timeline.detachAnimation(this.scene.currentCamera);
      this.scene.keyframes.camera = updateCamera(this.scene.keyframes.camera);
      this.scene.currentCamera = this.scene.animationLoop.timeline.attachAnimation(
        this.scene.keyframes.camera
      );
    }

    const innerOnStop = () => {
      this.enabled = false;
      if (onStop) {
        onStop();
      }
    };
    this.shouldAnimate = true;
    this.videoCapture.render(Encoder, encoderSettings, this.scene.lengthMs, innerOnStop);
    this.scene.animationLoop.timeline.setTime(this.videoCapture.encoderSettings.startOffsetMs);
    this.enabled = true;
  }

  /**
   * @param {() => void} callback
   */
  stop(callback) {
    this.enabled = false;
    this.shouldAnimate = false;
    this.videoCapture.stop(callback);
  }

  async _deckOnLoad(deck) {
    this.deck = deck;

    const animationLoop = deck.animationLoop;
    animationLoop.timeline.pause();
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
    if (!this.scene) {
      return null;
    }
    const frame = this.scene.keyframes.camera.getFrame();
    return frame;
  }

  _getLayers() {
    if (!this.scene) {
      return [];
    }
    return this.scene.renderLayers();
  }

  /**
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  onAfterRender(proceedToNextFrame) {
    this.videoCapture.capture(this.deck.canvas, nextTimeMs => {
      this.scene.animationLoop.timeline.setTime(nextTimeMs);
      proceedToNextFrame(nextTimeMs);
    });
  }
}
