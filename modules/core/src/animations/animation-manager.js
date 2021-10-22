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

export default class AnimationManager {
  timeline;
  animations = {};

  /**
   * @param {Object} params
   * @param {any} params.timeline
   * @param {any[]} params.animations
   */
  constructor({timeline = undefined, animations = []}) {
    this.timeline = timeline || new Timeline();
    for (const animation of animations) {
      this.attachAnimation(animation);
    }
  }

  attachAnimation(animation) {
    animation.attachKeyframes(this.timeline);
    this.animations[animation.id] = animation;
  }

  setKeyframes(animationId, params) {
    this.animations[animationId].setKeyframes({
      timeline: this.timeline,
      ...params
    });
  }

  getKeyframes(animationId) {
    return this.animations[animationId].getKeyframes();
  }

  getAnimation(animationId) {
    return this.animations[animationId];
  }

  draw() {
    Object.values(this.animations).forEach(animation => animation.draw());
  }
}
