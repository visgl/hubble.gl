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
import {DeckScene} from '../scene';
import {VideoCapture} from '../capture/video-capture';

export default class DeckAdapter {
  /** @type {any} */
  deck;
  /** @type {DeckScene} */
  scene;
  /** @type {boolean} */
  shouldAnimate;
  /** @type {boolean} */
  enabled;
  /** @type {WebGL2RenderingContext} */
  glContext;

  /**
   * @param {Object} params
   * @param {DeckScene} params.scene
   * @param {WebGL2RenderingContext} params.glContext
   */
  constructor({scene = undefined, glContext = undefined}) {
    this.scene = scene || new DeckScene({});
    this.glContext = glContext;
    this.videoCapture = new VideoCapture();
    this.shouldAnimate = true;
    this.enabled = false;
    this.getProps = this.getProps.bind(this);
    this.render = this.render.bind(this);
    this.stop = this.stop.bind(this);
    this.seek = this.seek.bind(this);
  }

  /**
   * @param {Object} params
   * @param {any} params.deck
   * @param {(nextTimeMs: number) => void} params.onNextFrame
   * @param {(scene: DeckScene) => any[]} params.getLayers
   * @param {Object} params.extraProps
   */
  getProps({deck, onNextFrame = undefined, getLayers = undefined, extraProps = undefined}) {
    this.deck = deck;
    const props = {
      _animate: this.shouldAnimate
    };

    if (onNextFrame) {
      props.onAfterRender = () => this.onAfterRender(onNextFrame);
    }

    // Animating the camera is optional, but if a keyframe is defined then viewState is controlled by camera keyframe.
    if (this.scene.cameraKeyframes && this.enabled) {
      props.controller = false;
      props.viewState = this.scene.getCameraFrame();
    }

    // Construct layers using callback.
    // TODO: Could potentially concat instead of replace, but layers are supposed to be static.
    if (getLayers) {
      props.layers = getLayers(this.scene);
    }

    if (this.glContext) {
      props.gl = this.glContext;
    }
    return {...extraProps, ...props};
  }

  /**
   * @param {Object} params
   * @param {() => import('../keyframes').CameraKeyframes} params.getCameraKeyframes
   * @param {() => Object<string, import('../keyframes').Keyframes>} params.getLayerKeyframes
   * @param {typeof import('../encoders').FrameEncoder} params.Encoder
   * @param {Partial<import('types').FormatConfigs>} params.formatConfigs
   * @param {() => void} params.onStop
   * @param {string} params.filename
   * @param {{start: number, end: number, framerate: number}} params.timecode
   */
  render({
    getCameraKeyframes = undefined,
    getLayerKeyframes = undefined,
    Encoder = PreviewEncoder,
    formatConfigs = {},
    onStop = undefined,
    filename = undefined,
    timecode = {start: 0, end: 0, framerate: 30}
  }) {
    if (getCameraKeyframes) {
      this.scene.setCameraKeyframes(getCameraKeyframes());
    }
    if (getLayerKeyframes) {
      this.scene.setLayerKeyframes(getLayerKeyframes());
    }

    const innerOnStop = () => {
      this.enabled = false;
      if (onStop) {
        onStop();
      }
    };
    this.shouldAnimate = true;
    this.videoCapture.render(Encoder, formatConfigs, timecode, filename, innerOnStop);
    this.scene.timeline.setTime(timecode.start);
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

  /**
   * @param {Object} params
   * @param {number} params.timeMs
   * @param {() => import('../keyframes').CameraKeyframes} params.getCameraKeyframes
   * @param {() => Object<string, import('../keyframes').Keyframes>} params.getLayerKeyframes
   */
  seek({timeMs, getCameraKeyframes = undefined, getLayerKeyframes = undefined}) {
    if (getCameraKeyframes) {
      this.scene.setCameraKeyframes(getCameraKeyframes());
    }
    if (getLayerKeyframes) {
      this.scene.setLayerKeyframes(getLayerKeyframes());
    }
    this.scene.timeline.setTime(timeMs);
  }

  /**
   * @param {(nextTimeMs: number) => void} proceedToNextFrame
   */
  onAfterRender(proceedToNextFrame) {
    if (this.videoCapture.isRecording()) {
      this.videoCapture.capture(this.deck.canvas, nextTimeMs => {
        this.scene.timeline.setTime(nextTimeMs);
        proceedToNextFrame(nextTimeMs);
      });
    }
  }
}
