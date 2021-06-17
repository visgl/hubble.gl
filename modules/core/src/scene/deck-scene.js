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
  /**
   * @param {Object} params
   * @param {any} params.timeline
   * @param {Object<string, import('keyframes').Keyframes>} params.initialKeyframes
   */

  constructor({timeline = undefined, initialKeyframes = undefined}) {
    this.timeline = timeline || new Timeline();
    this.keyframes = {};
    this.animations = {};
    if (initialKeyframes) {
      this.setKeyframes(initialKeyframes);
    }

    this.setCameraKeyframes = this.setCameraKeyframes.bind(this);
  }

  setCameraKeyframes(cameraKeyframes) {
    this.setKeyframes({camera: cameraKeyframes});
  }

  setKeyframes(keyframes) {
    this.keyframes = {...this.keyframes, ...keyframes};
    for (const keyframe in keyframes) {
      const animation = this.animations[keyframe];
      if (animation) {
        this.timeline.detachAnimation(animation);
      }
      this.animations[keyframe] = this.timeline.attachAnimation(this.keyframes[keyframe]);
    }
  }
}
