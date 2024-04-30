// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {KeyFrames as LumaKeyFrames} from '@luma.gl/engine';
import {linear, Easing} from './easings';
import {
  sanitizeEasings,
  merge,
  sanitizeTimings,
  factorInterpolator,
  sanitizeInterpolators
} from './utils';

export type Keyframe<T> = [number, (T & {
  ease: Easing;
  interpolate: string;
})]

export type KeyframeProps<T> = {
  timings: number | number[],
  keyframes?: T[],
  easings?: Easing | Easing[],
  interpolators?: string | string[]
  features?: string[]
}

class Keyframes<T extends object> extends LumaKeyFrames<(T & {
  ease: Easing;
  interpolate: string;
})> {
  activeFeatures = {};
  /** Set when this is attached to an Animation */
  animationHandle?: number;
  timings: number | number[];
  keyframes: T[];
  easings: Easing | Easing[];
  interpolators: string | string[];

  constructor({
    features = [], 
    timings, 
    keyframes, 
    easings = linear, 
    interpolators = 'linear'
  }: KeyframeProps<T>) {
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

  set({
    timings, 
    keyframes, 
    easings = linear, 
    interpolators = 'linear'
  }: KeyframeProps<T>) {
    if (keyframes.length === 0) {
      throw new Error('There must be at least one keyframe');
    }

    const _interpolators = sanitizeInterpolators(keyframes, interpolators);

    const _easings = sanitizeEasings(keyframes, easings);

    const _timings = sanitizeTimings(keyframes, timings);

    this._setActiveFeatures(keyframes);
    const _keyframes = merge<T>(_timings, keyframes, _easings, _interpolators);
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
    const frame: T = {} as T;

    Object.keys(this.activeFeatures).forEach(key => {
      if (this.activeFeatures[key]) {
        frame[key] = factorInterpolator(start[key], end[key], end.ease)(factor);
      }
    });

    return frame;
  }

  _setActiveFeatures(keyframes: T[]) {
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
