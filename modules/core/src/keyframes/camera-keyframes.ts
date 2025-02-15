// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, {KeyframeProps} from './keyframes';
import {flyToViewport} from '@math.gl/web-mercator';
import {lerp} from '@math.gl/core';
import type {Easing} from './easings';

const LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];
const DEFAULT_OPTS = {
  speed: 1.2,
  curve: 1.414
  // screenSpeed and maxDuration are used only if specified
};

export function flyToInterpolator(
  start: CameraDataType & {ease?: Easing; width: number; height: number},
  end: CameraDataType & {ease?: Easing},
  factor: number,
  options?: {speed?: number; curve?: number; maxDuration?: number}
) {
  const viewport = flyToViewport(
    start,
    // @ts-ignore width/height not necessary on end
    end,
    end.ease(factor),
    {
      ...DEFAULT_OPTS,
      ...options
    }
  );

  // Linearly interpolate 'bearing' and 'pitch'.
  // If pitch/bearing are not supplied, they are interpreted as zeros in viewport calculation
  // (fallback defined in WebMercatorViewport)
  // Because there is no guarantee that the current controller's ViewState normalizes
  // these props, safe guard is needed to avoid generating NaNs
  for (const key of LINEARLY_INTERPOLATED_PROPS) {
    viewport[key] = lerp(start[key] || 0, end[key] || 0, end.ease(factor));
  }

  return viewport;
}

export type CameraDataType = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

export type CameraKeyframeProps = KeyframeProps<CameraDataType> & {width: number; height: number};

export default class CameraKeyFrames extends Keyframes<CameraDataType> {
  width: number;
  height: number;

  constructor({timings, keyframes, easings, interpolators, width, height}: CameraKeyframeProps) {
    super({
      timings,
      keyframes,
      easings,
      interpolators
    });

    this.width = width;
    this.height = height;
  }

  getFrame() {
    const factor = this.factor;
    const start = this.getStartData();
    const end = this.getEndData();

    if (end.interpolate === 'flyTo') {
      if (!this.width || !this.height) {
        throw new Error('width and height must be defined to use flyTo interpolator');
      }
      const maxDuration = this.getEndTime() - this.getStartTime();
      return flyToInterpolator({...start, width: this.width, height: this.height}, end, factor, {
        maxDuration
      });
    }

    return super.getFrame();
  }
}
