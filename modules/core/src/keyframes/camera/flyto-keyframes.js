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
import Keyframes from '../keyframes';
import {FlyToInterpolator} from '@deck.gl/core';

export default class FlyToKeyframes extends Keyframes {
  constructor({
    start,
    end,
    width,
    height,
    curve = 1.414,
    speed = 1.2,
    screenSpeed = undefined,
    maxDuration = undefined
  }) {
    const interpolator = new FlyToInterpolator({curve, speed, screenSpeed, maxDuration});

    start = {...start, width, height};
    end = {...end, transitionDuration: 'auto'};

    const duration = interpolator.getDuration(start, end);

    super({
      timings: [0, duration],
      keyframes: [start, end],
      easings: [t => t],
      features: ['latitude', 'longitude', 'zoom', 'pitch', 'bearing']
    });
    this.interpolator = interpolator;
  }

  getFrame() {
    const factor = this.factor;
    const start = this.getStartData();
    const end = this.getEndData();
    return this.interpolator.interpolateProps(start, end, factor);
  }

  getDuration() {
    const start = this.getStartData();
    const end = this.getEndData();
    return this.interpolator.getDuration(start, end);
  }
}
