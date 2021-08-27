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
import test from 'tape-catch';

import {
  timeRangeKeyframes
  // @ts-ignore
  // eslint-disable-next-line import/no-unresolved
} from '@hubble.gl/core/keyframes/kepler-filter-keyframes';

const intervalFilter = {
  type: 'timeRange',
  id: 'test-test',
  animationWindow: 'interval',
  value: [1421315219000, 1421315400000],
  domain: [1421315219000, 1421348744000],
  plotType: {
    type: 'histogram',
    interval: '5-minute'
  },
  bins: {
    a543fcbd: {
      '5-minute': [
        {
          x0: 1421315100000,
          x1: 1421315400000
        },
        {
          x0: 1421315400000,
          x1: 1421315700000
        },
        {
          x0: 1421315700000,
          x1: 1421316000000
        }
      ]
    }
  }
};
const TEST_CASES = [
  {
    args: {
      filter: intervalFilter,
      timings: [0, 1000]
    },
    expected: {
      keyframes: [
        {value: [1421315100000, 1421315400000]},
        {value: [1421315400000, 1421315700000]},
        {value: [1421315700000, 1421316000000]}
      ],
      timings: [0, 333, 666]
    },
    message: 'keyframes for interval filter should be correct'
  }
];

test('KeplerFilterKeyframes#timeRangeKeyframes', t => {
  TEST_CASES.forEach(testCase => {
    const result = timeRangeKeyframes(testCase.args);
    t.deepEqual(result.keyframes, testCase.expected.keyframes, testCase.message);
    t.deepEqual(result.timings, testCase.expected.timings, testCase.message);
  });

  t.end();
});
