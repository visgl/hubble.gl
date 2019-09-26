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
// import {factorInterpolator} from '../utils';

class FilterValueKeyframes extends Keyframes {
  filterId;

  constructor({filterId, timings, keyframes, easings}) {
    super({timings, keyframes, easings, features: ['left', 'right']});
    this.filterId = filterId;
  }

  // getFrame() {
  //   const factor = this.factor;
  //   const start = this.getStartData();
  //   const end = this.getEndData();

  //   let frame = {};

  //   if (this.activeProps.value) {
  //     const valueLeft = factorInterpolator(start[0], end[0], end.ease);
  //     const valueRight = factorInterpolator(start[1], end[1], end.ease);

  //     frame.value = [valueLeft(factor), valueRight(factor)];
  //   }

  //   return frame;
  // }
}

export default FilterValueKeyframes;
