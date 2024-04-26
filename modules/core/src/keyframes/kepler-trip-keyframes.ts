// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, { KeyframeConstructorProps, KeyframeProps } from './keyframes';

type AnimationConfig = {
  domain: [number, number]
}

function tripKeyframes({animationConfig}: {animationConfig: AnimationConfig}) {
  return {
    keyframes: [{currentTime: animationConfig.domain[0]}, {currentTime: animationConfig.domain[1]}]
  };
}

type TripKeyframe = {
  currentTime: number
}

export type KeplerTripKeyframeConstructorProps = Omit<KeyframeConstructorProps<TripKeyframe>, 'keyframes'> & { keyframes?: TripKeyframe[], animationConfig?: AnimationConfig}

export type KeplerTripKeyframeProps = Omit<KeyframeProps<TripKeyframe>, 'keyframes'> & { keyframes?: TripKeyframe[], animationConfig?: AnimationConfig }

class KeplerTripKeyframes extends Keyframes<TripKeyframe> {
  constructor({animationConfig = undefined, timings, keyframes, easings, interpolators}: KeplerTripKeyframeConstructorProps) {
    super(
      KeplerTripKeyframes._processParams({
        animationConfig,
        timings,
        keyframes,
        easings,
        interpolators
      })
    );
  }

  set({animationConfig = undefined, timings, keyframes, easings, interpolators}: KeplerTripKeyframeProps) {
    super.set(
      KeplerTripKeyframes._processParams({
        animationConfig,
        timings,
        keyframes,
        easings,
        interpolators
      })
    );
  }

  static _processParams({animationConfig = undefined, timings, keyframes, easings, interpolators}: KeplerTripKeyframeProps) {
    let params: KeyframeConstructorProps<TripKeyframe> = {features: ['currentTime'], timings, keyframes, easings, interpolators};
    if (animationConfig && keyframes === undefined) {
      if (Array.isArray(timings) && timings.length !== 2) throw new Error('[start, end] timings required.');
      params = {...params, ...tripKeyframes({animationConfig})};
    }
    return params;
  }
}
export default KeplerTripKeyframes;
