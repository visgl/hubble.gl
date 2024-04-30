// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import test from 'tape-catch';

import {
  type KeplerFilter,
  timeRangeKeyframes
} from '@hubble.gl/core/src/keyframes/kepler-filter-keyframes';

const intervalFilter: KeplerFilter = {
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
