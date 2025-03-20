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
import type {KeyFrame} from '@luma.gl/engine/src/animation/key-frames';

export type Keyframe<T> = [
  number,
  T & {
    ease?: Easing;
    interpolate?: string;
  }
];

export type KeyframeProps<T> = {
  timings: number | number[];
  keyframes?: T[];
  easings?: Easing | Easing[];
  interpolators?: string | string[];
};

class Keyframes<T extends object> extends LumaKeyFrames<
  T & {
    ease?: Easing;
    interpolate?: string;
  }
> {
  features: string[];
  /** Set when this is attached to an Animation */
  animationHandle?: number;
  timings!: number | number[];
  keyframes!: T[];
  easings!: Easing | Easing[];
  interpolators!: string | string[];

  constructor({timings, keyframes, easings = linear, interpolators = 'linear'}: KeyframeProps<T>) {
    super([]);
    this.getFrame = this.getFrame.bind(this);
    this.set = this.set.bind(this);
    this.set({timings, keyframes, easings, interpolators});
  }

  set({timings, keyframes, easings = linear, interpolators = 'linear'}: KeyframeProps<T>) {
    if (!keyframes || keyframes.length === 0) {
      throw new Error('There must be at least one keyframe');
    }

    const _interpolators = sanitizeInterpolators(keyframes, interpolators);

    const _easings = sanitizeEasings(keyframes, easings);

    const _timings = sanitizeTimings(keyframes, timings);

    this._setFeatures(keyframes);
    const _keyframes = merge<T>(_timings, keyframes, _easings, _interpolators);
    this.keyframes = keyframes;
    this.timings = timings;
    this.easings = easings;
    this.interpolators = interpolators;
    this.setKeyFrames(
      _keyframes as Array<
        KeyFrame<
          T & {
            ease?: Easing;
            interpolate?: string;
          }
        >
      >
    );
  }

  getFrame() {
    const factor = this.factor;
    const start = this.getStartData();
    const end = this.getEndData();
    const frame: T = {} as T;

    for (const feature of this.features) {
      frame[feature] = factorInterpolator(start[feature], end[feature], end.ease)(factor);
    }

    return frame;
  }

  _setFeatures(keyframes: T[]) {
    const firstKeyframe = keyframes[0];
    this.features = Object.keys(firstKeyframe);
  }
}

export default Keyframes;
