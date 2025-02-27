// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, {KeyframeProps} from './keyframes';

export type KeplerAnimationConfig = {
  domain: [number, number];
};

function tripKeyframes({animationConfig}: {animationConfig: KeplerAnimationConfig}) {
  return {
    keyframes: [{currentTime: animationConfig.domain[0]}, {currentTime: animationConfig.domain[1]}]
  };
}

export type TripDataType = {
  currentTime: number;
};

export type KeplerTripKeyframeProps = Omit<KeyframeProps<TripDataType>, 'keyframes'> & {
  keyframes?: TripDataType[];
  animationConfig?: KeplerAnimationConfig;
};

class KeplerTripKeyframes extends Keyframes<TripDataType> {
  constructor({
    animationConfig = undefined,
    timings,
    keyframes = undefined,
    easings,
    interpolators
  }: KeplerTripKeyframeProps) {
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

  set({
    animationConfig = undefined,
    timings,
    keyframes = undefined,
    easings,
    interpolators
  }: KeplerTripKeyframeProps) {
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

  static _processParams({
    animationConfig = undefined,
    timings,
    keyframes = undefined,
    easings,
    interpolators
  }: KeplerTripKeyframeProps) {
    let params: KeyframeProps<TripDataType> = {
      timings,
      keyframes,
      easings,
      interpolators
    };
    if (animationConfig && keyframes === undefined) {
      if (!Array.isArray(timings) || timings.length !== 2)
        throw new Error('[start, end] timings required.');
      params = {...params, ...tripKeyframes({animationConfig})};
    }
    return params;
  }
}
export default KeplerTripKeyframes;
