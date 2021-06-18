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
import {Timeline} from '@luma.gl/engine';

export default class DeckScene {
  timeline;
  /** @type {import('keyframes').CameraKeyframes} */
  cameraKeyframes;
  /** @type {Object<string, import('keyframes').Keyframes>} */
  layerKeyframes;

  /**
   * @param {Object} params
   * @param {any} params.timeline
   * @param {import('keyframes').CameraKeyframes} params.cameraKeyframes
   * @param {Object<string, import('keyframes').Keyframes>} params.layerKeyframes
   */
  constructor({timeline = undefined, cameraKeyframes = undefined, layerKeyframes = undefined}) {
    this.timeline = timeline || new Timeline();
    this.layerKeyframes = {};

    if (cameraKeyframes) {
      this.setCameraKeyframes(cameraKeyframes);
    }

    if (layerKeyframes) {
      this.setLayerKeyframes(layerKeyframes);
    }
  }

  attachAnimation(keyframes) {
    if (keyframes.animationHandle) {
      this.timeline.detachAnimation(keyframes.animationHandle);
    }
    keyframes.animationHandle = this.timeline.attachAnimation(keyframes);
  }

  setCameraKeyframes(cameraKeyframes) {
    this.cameraKeyframes = cameraKeyframes;
    this.attachAnimation(cameraKeyframes);
  }

  getCameraFrame() {
    if (!this.cameraKeyframes) return undefined;
    return this.cameraKeyframes.getFrame();
  }

  setLayerKeyframes(layerKeyframes) {
    this.layerKeyframes = {...this.layerKeyframes, ...layerKeyframes};
    for (const keyframeId in layerKeyframes) {
      this.attachAnimation(this.layerKeyframes[keyframeId]);
    }
  }

  getLayerFrame() {
    return Object.entries(this.layerKeyframes).reduce((frame, [key, keyframe]) => {
      frame[key] = keyframe.getFrame();
      return frame;
    }, {});
  }
}
