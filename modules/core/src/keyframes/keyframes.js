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
import {KeyFrames as LumaKeyFrames} from '@luma.gl/engine';
import {linear} from './easings';
import {
  sanitizeEasings,
  merge,
  sanitizeTimings,
  factorInterpolator,
  sanitizeInterpolators
} from './utils';

class Keyframes extends LumaKeyFrames {
  activeFeatures = {};
  animationHandle;
  timings;
  keyframes;
  easings;
  interpolators;

  constructor({features, timings, keyframes, easings = linear, interpolators = 'linear'}) {
    super([]);
    this._setActiveFeatures = this._setActiveFeatures.bind(this);
    this.getFrame = this.getFrame.bind(this);
    this.set = this.set.bind(this);

    this.activeFeatures = features.reduce((activeFeatures, feature) => {
      activeFeatures[feature] = false;
      return activeFeatures;
    }, {});

    this.set({timings, keyframes, easings, interpolators});
  }

  set({timings, keyframes, easings = linear, interpolators = 'linear'}) {
    if (keyframes.length === 0) {
      throw new Error('There must be at least one keyframe');
    }

    const _interpolators = sanitizeInterpolators(keyframes, interpolators);

    const _easings = sanitizeEasings(keyframes, easings);

    const _timings = sanitizeTimings(keyframes, timings);

    this._setActiveFeatures(keyframes);
    const _keyframes = merge(_timings, keyframes, _easings, _interpolators);
    this.keyframes = keyframes;
    this.timings = timings;
    this.easings = easings;
    this.interpolators = interpolators;
    this.setKeyFrames(_keyframes);
  }

  getFrame() {
    const factor = this.factor;
    const start = this.getStartData();
    const end = this.getEndData();
    const frame = {};

    Object.keys(this.activeFeatures).forEach(key => {
      if (this.activeFeatures[key]) {
        frame[key] = factorInterpolator(start[key], end[key], end.ease)(factor);
      }
    });

    return frame;
  }

  _setActiveFeatures(keyframes) {
    const firstKeyframe = keyframes[0];
    this.activeFeatures = Object.keys(firstKeyframe).reduce((activeFeatures, key) => {
      // activate only keys that are expected
      if (firstKeyframe[key] !== undefined) {
        activeFeatures[key] = true;
      }
      return activeFeatures;
    }, this.activeFeatures);
  }
}

export default Keyframes;
