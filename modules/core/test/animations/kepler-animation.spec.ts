// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import test from 'tape-catch';

import {
  findLayer,
  findFilterIdx
} from '@hubble.gl/core/src/animations/kepler-animation';

import {KeplerAnimation} from '@hubble.gl/core';
import type { KeplerFilter } from '@hubble.gl/core/src/keyframes';

const layers = [
  {id: '2', config: {label: 'a', visConfig: {}}},
  {id: '1', config: {label: 'b', visConfig: {}}},
  {id: '3', config: {label: 'a', visConfig: {}}}
];

const FIND_LAYER_TEST_CASES = [
  {
    args: {
      layers,
      layerKeyframe: {id: '3', label: 'a'}
    },
    expected: {id: '3', config: {label: 'a'}},
    message: 'layer should be found by keyframe id'
  },
  {
    args: {
      layers,
      layerKeyframe: {label: 'b'}
    },
    expected: {id: '1', config: {label: 'b'}},
    message: 'layer should be found by keyframe label if id is missing'
  },
  {
    args: {
      layers,
      layerKeyframe: {label: 'a'}
    },
    expected: {id: '2', config: {label: 'a'}},
    message: 'first matching layer should be found by keyframe label'
  },
  {
    args: {
      layers,
      layerKeyframe: {id: 'unknown'}
    },
    expected: undefined,
    message: 'unknown layers shouldnt be found'
  }
];

test('KeplerAnimation#findLayer', t => {
  FIND_LAYER_TEST_CASES.forEach(testCase => {
    const result = findLayer(testCase.args);
    t.deepEqual(result, testCase.expected, testCase.message);
  });

  t.end();
});

const filters: KeplerFilter[] = [
  {
    id: 'f_1',
    type: 'timeRange',
    animationWindow: 'free',
    value: [0, 1],
    domain: [0, 1],
    bins: { 
      someBin: {
        '1-minute': [{ x0: 0, x1: 1 }]
      }
    },
    plotType: {
      type: '',
      interval: '1-minute'
    }
  }, {
    id: 'f_2',
    type: 'timeRange',
    animationWindow: 'free',
    value: [0, 1],
    domain: [0, 1],
    bins: { 
      someBin: {
        '1-minute': [{ x0: 0, x1: 1 }]
      }
    },
    plotType: {
      type: '',
      interval: '1-minute'
    }
  }];

const FIND_FILTER_TEST_CASES = [
  {
    args: {
      filters,
      filterKeyframe: {filterIdx: 0}
    },
    expected: 0,
    message: 'filter found by filter index should be correct'
  },
  {
    args: {
      filters,
      filterKeyframe: {id: 'f_2'}
    },
    expected: 1,
    message: 'filter found by filter id should be correct'
  },
  {
    args: {
      filters,
      filterKeyframe: {id: 'f_unknown'}
    },
    expected: -1,
    message: 'unknwon filter should be undefined'
  }
];

test('KeplerAnimation#findFilterIdx', t => {
  FIND_FILTER_TEST_CASES.forEach(testCase => {
    const result = findFilterIdx(testCase.args);
    t.deepEqual(result, testCase.expected, testCase.message);
  });

  t.end();
});

const ANIMATION_TEST_CASES = [
  {
    args: {
      layers,
      layerKeyframes: [],
      filters,
      filterKeyframes: []
    },
    expected: {
      cameraKeyframe: undefined,
      layerKeyframes: {},
      filterKeyframes: {},
      tripKeyframe: undefined,
      unattachedKeyframes: []
    },
    message: 'no keyframes should make an empty animation'
  }
];

test('KeplerAnimation#contruct empty', t => {
  ANIMATION_TEST_CASES.forEach(testCase => {
    const result = new KeplerAnimation(testCase.args);
    t.deepEqual(result.cameraKeyframe, testCase.expected.cameraKeyframe, testCase.message);
    t.deepEqual(result.layerKeyframes, testCase.expected.layerKeyframes, testCase.message);
    t.deepEqual(result.filterKeyframes, testCase.expected.filterKeyframes, testCase.message);
    t.deepEqual(result.tripKeyframe, testCase.expected.tripKeyframe, testCase.message);
    t.deepEqual(
      result.unattachedKeyframes,
      testCase.expected.unattachedKeyframes,
      testCase.message
    );
  });

  t.end();
});
