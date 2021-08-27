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
  findLayer,
  findFilterIdx
  // @ts-ignore
  // eslint-disable-next-line import/no-unresolved
} from '@hubble.gl/core/animations/kepler-animation';

import {KeplerAnimation} from '@hubble.gl/core';

const layers = [
  {id: '2', config: {label: 'a'}},
  {id: '1', config: {label: 'b'}},
  {id: '3', config: {label: 'a'}}
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

const filters = [{id: 'f_1'}, {id: 'f_2'}];

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
      filterKeyframe: 1
    },
    expected: {filterIdx: undefined, id: 'f_2'},
    message: 'filter found by filter id should be correct'
  },
  {
    args: {
      filters,
      filterKeyframe: {filterIdx: undefined, id: 'f_unknown'}
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
