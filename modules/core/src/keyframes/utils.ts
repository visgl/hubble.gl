// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {interpolate, linear} from 'popmotion';
import type {Keyframe} from './keyframes';
import type {Easing} from './easings';

export function sanitizeInterpolators<K>(keyframes: K[], interpolators: string | string[]) {
  if (typeof interpolators === 'string') {
    const _interpolators: string[] = [];
    for (let idx = 0; idx < keyframes.length - 1; idx++) {
      _interpolators.push(interpolators);
    }
    return _interpolators;
  }

  if (keyframes.length - 1 !== interpolators.length) {
    throw new Error('There must be one fewer interpolator than keyframes');
  }
  return interpolators;
}

export function sanitizeEasings<K>(keyframes: K[], easings: Easing | Easing[]) {
  if (typeof easings === 'function') {
    const _easings: Easing[] = [];
    for (let idx = 0; idx < keyframes.length - 1; idx++) {
      _easings.push(easings);
    }
    return _easings;
  }

  if (keyframes.length - 1 !== easings.length) {
    throw new Error('There must be one fewer easing than keyframes');
  }

  return easings;
}

export function sanitizeTimings<K>(keyframes: K[], timings: number | number[]) {
  if (typeof timings === 'number') {
    const _timings: number[] = [];
    let time = 0;
    for (let idx = 0; idx < keyframes.length; idx++) {
      _timings.push(time);
      time += timings;
    }
    return _timings;
  }
  if (keyframes.length !== timings.length) {
    throw new Error('There must be same number of timings as keyframes');
  }
  return timings;
}

export function merge<T>(
  timings: number[],
  keyframes: T[],
  easings: Easing[],
  interpolators: string[]
) {
  const _keyframes: Keyframe<T>[] = keyframes.map((keyframe, idx: number) => {
    if (idx === 0) {
      return [timings[idx], {...keyframe, ease: undefined, interpolate: undefined}];
    }
    return [
      timings[idx],
      {...keyframe, ease: easings[idx - 1], interpolate: interpolators[idx - 1]}
    ];
  });
  return _keyframes;
}

export function factorInterpolator(start: number, end: number, ease = linear) {
  return interpolate([0, 1], [start, end], {ease});
}
