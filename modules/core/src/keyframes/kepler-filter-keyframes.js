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
import {factorInterpolator} from './utils';
import Keyframes from './keyframes';
import {hold, linear} from './easings';

/**
 * 4 Animation Window Types
 * 1. free
 *  |->  |->
 * Current time is a fixed range, animation controller calls next animation frames continuously to animation a moving window
 * The increment id based on domain / BASE_SPEED * SPEED
 *
 * 2. incremental
 * |    |->
 * Same as free, current time is a growing range, only the max value of range increment during animation.
 * The increment is also based on domain / BASE_SPEED * SPEED
 *
 * 3. point
 * o -> o
 * Current time is a point, animation controller calls next animation frame continuously to animation a moving point
 * The increment is based on domain / BASE_SPEED * SPEED
 *
 * 4. interval
 * o ~> o
 * Current time is a point. An array of sorted time steps need to be provided.
 * animation controller calls next animation at a interval when the point jumps to the next step
 */
function getKeyFramesFree(filter) {
  const delta = filter.value[1] - filter.value[0];
  return {
    keyframes: [
      {value: [filter.domain[0], filter.domain[0] + delta]},
      {value: [filter.domain[1] - delta, filter.domain[1]]}
    ],
    easings: linear
  };
}

export function timeRangeKeyframes({filter, timings}) {
  if (filter.type !== 'timeRange') {
    throw new Error("filter type must be 'timeRange'.'");
  }

  const duration = timings[1] - timings[0];

  switch (filter.animationWindow) {
    default:
    case 'free': {
      return getKeyFramesFree(filter);
    }
    case 'incremental': {
      return {
        keyframes: [
          {value: [filter.value[0], filter.value[0] + 1]},
          {value: [filter.value[0], filter.domain[1]]}
        ],
        easings: linear
      };
    }
    case 'point': {
      return {
        keyframes: [{value: filter.domain[0]}, {value: filter.domain[1]}],
        easings: linear
      };
    }
    case 'interval': {
      const {bins, plotType} = filter;
      const {interval} = plotType;
      if (
        !interval ||
        !bins ||
        Object.keys(bins).length === 0 ||
        !Object.values(bins)[0][interval]
      ) {
        // shouldn't happen return
        return getKeyFramesFree(filter);
      }
      const intervalBins = Object.values(bins)[0][interval];
      const delta = Math.round(duration / intervalBins.length);

      // const delta = Math.round(duration / filter.steps.length);
      return {
        timings: intervalBins.map((_, idx) => timings[0] + delta * idx),
        keyframes: intervalBins.map(bin => {
          return {
            value: [bin.x0, bin.x1]
          };
        }),
        easings: hold
      };
    }
  }
}

class KeplerFilterKeyframes extends Keyframes {
  id;
  type;
  filterIdx;
  getTimeRangeFilterKeyframes;

  constructor({
    filter,
    filterIdx,
    timings,
    keyframes,
    easings,
    interpolators,
    getTimeRangeFilterKeyframes = undefined
  }) {
    if (filter.type === 'input') {
      throw new Error("filter type 'input' is not supported.");
    }
    super(
      KeplerFilterKeyframes._processParams({
        filter,
        timings,
        keyframes,
        easings,
        interpolators,
        getTimeRangeFilterKeyframes
      })
    );
    this.id = filter.id;
    this.type = filter.type;
    this.animationWindow = filter.animationWindow;
    this.filterIdx = filterIdx;
    this.getTimeRangeFilterKeyframes = getTimeRangeFilterKeyframes;
  }

  set({filter = undefined, filterIdx = undefined, timings, keyframes, easings, interpolators}) {
    if (filter && filterIdx) {
      this.id = filter.id;
      this.type = filter.type;
      this.animationWindow = filter.animationWindow;
      this.filterIdx = filterIdx;
    }
    super.set(
      KeplerFilterKeyframes._processParams({
        filter,
        timings,
        keyframes,
        easings,
        interpolators,
        getTimeRangeFilterKeyframes: this.getTimeRangeFilterKeyframes
      })
    );
  }

  getFrame() {
    const factor = this.factor;
    const start = this.getStartData();
    const end = this.getEndData();

    if (['select', 'multiSelect', 'polygon'].includes(this.type)) {
      return start.value;
    }

    if (this.type === 'range') {
      return [
        factorInterpolator(start.value[0], end.value[0], end.ease)(factor),
        factorInterpolator(start.value[1], end.value[1], end.ease)(factor)
      ];
    }

    if (this.type === 'timeRange') {
      switch (this.animationWindow) {
        case 'free':
        case 'incremental': {
          return [
            factorInterpolator(start.value[0], end.value[0], end.ease)(factor),
            factorInterpolator(start.value[1], end.value[1], end.ease)(factor)
          ];
        }
        case 'point': {
          return factorInterpolator(start.value, end.value, end.ease)(factor);
        }
        case 'interval':
        default: {
          return start.value;
        }
      }
    }

    return super.getFrame();
  }

  static _processParams({
    filter = undefined,
    timings,
    keyframes,
    easings,
    interpolators,
    getTimeRangeFilterKeyframes = undefined
  }) {
    let params = {features: ['value'], timings, keyframes, easings, interpolators};
    if (filter && filter.type === 'timeRange' && keyframes === undefined) {
      if (timings.length !== 2) throw new Error('[start, end] timings required.');
      params = {
        ...params,
        ...(getTimeRangeFilterKeyframes
          ? getTimeRangeFilterKeyframes({filter, timings})
          : timeRangeKeyframes({filter, timings}))
      };
    }
    return params;
  }
}

export default KeplerFilterKeyframes;
