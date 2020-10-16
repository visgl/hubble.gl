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
import {KeyFrames as LumaKeyFrames} from '@luma.gl/engine';
import {sanitizeEasings, merge, sanitizeTimings, factorInterpolator} from './utils';

class Keyframes extends LumaKeyFrames {
  activeFeatures = {};
  constructor({features, timings, keyframes, easings}) {
    super([]);
    this._setActiveFeatures = this._setActiveFeatures.bind(this);
    this.getFrame = this.getFrame.bind(this);

    if (keyframes.length === 0) {
      throw new Error('There must be at least one keyframe');
    }

    const _easings = sanitizeEasings(keyframes, easings);

    const _timings = sanitizeTimings(keyframes, timings);

    this.activeFeatures = features.reduce((activeFeatures, feature) => {
      activeFeatures[feature] = false;
      return activeFeatures;
    }, {});

    this._setActiveFeatures(keyframes);
    const _keyframes = merge(_timings, keyframes, _easings);
    this.setKeyFrames(_keyframes);
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
}

export default Keyframes;
