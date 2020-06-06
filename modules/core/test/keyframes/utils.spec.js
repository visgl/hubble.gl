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
import test from 'tape-catch';

import {
  sanitizeEasings,
  sanitizeTimings,
  merge,
  factorInterpolator
  // @ts-ignore
  // eslint-disable-next-line import/no-unresolved
} from '@hubble.gl/core/keyframes/utils';

test('Keyframes#sanitizeEasings', t => {
  const keyframes = [undefined, undefined, undefined];
  function noop() {}
  t.equals(typeof noop, 'function', 'easings must be functions');
  const easings1 = [noop, noop];
  const sanitizedEasings1 = sanitizeEasings(keyframes, easings1);
  t.equals(sanitizedEasings1, easings1, 'valid easing array are unmodified');
  const easings2 = noop;
  const sanitizedEasings2 = sanitizeEasings(keyframes, easings2);
  t.looseEqual(sanitizedEasings2, easings1, 'easing function is expanded to full easing array');
  const easings3 = [noop];
  t.throws(
    () => sanitizeEasings(keyframes, easings3),
    'sanitizeEasings throws on incorrect number of easings'
  );
  t.end();
});

test('Keyframes#sanitizeTimings', t => {
  const keyframes = [undefined, undefined, undefined];
  const timings1 = [0, 2000, 4000];
  t.true(keyframes.length === timings1.length, 'timing and keyframes arrays must be same length');
  const sanitizedTimings1 = sanitizeTimings(keyframes, timings1);
  t.equals(sanitizedTimings1, timings1, 'valid timings array are unmodified');
  const timings2 = 2000;
  t.equals(
    typeof timings2,
    'number',
    'timings may be a number, which will be the duration of each transition'
  );
  const sanitizedtimings2 = sanitizeTimings(keyframes, timings2);
  t.looseEquals(sanitizedtimings2, timings1, 'timings number is expanded to full timing array');
  const timings3 = [100, 200];
  t.throws(
    () => sanitizeTimings(keyframes, timings3),
    /There must be same number of timings as keyframes/,
    'sanitizeTimings throws on incorrect number of timings'
  );
  t.end();
});

test('Keyframes#merge', t => {
  const noop = () => {};
  const timings1 = [0, 1, 2];
  const easings1 = [noop, noop];
  const keyframes1 = [{a: '', b: true}, {a: 'a', b: false}, {a: '2', b: true}];

  const expectedMergedKeyframes1 = [
    [0, {a: '', b: true, ease: undefined}],
    [1, {a: 'a', b: false, ease: noop}],
    [2, {a: '2', b: true, ease: noop}]
  ];

  const actualMergedKeyframes1 = merge(timings1, keyframes1, easings1);

  t.looseEquals(
    actualMergedKeyframes1,
    expectedMergedKeyframes1,
    'timings, keyframes, and easings are merged'
  );
  t.end();
});

test('Keyframes#factorInterpolator', t => {
  const start = 100;
  const end = 200;
  const ease1 = undefined;
  const int1 = factorInterpolator(start, end, ease1);

  t.is(int1(0), start, 'factor 0 is start');
  t.is(int1(1), end, 'factor 1 is end');
  const linearInBetween = start + (end - start) * 0.5;
  t.is(linearInBetween, 150);
  t.is(int1(0.5), linearInBetween, 'factor 0.5 is 50% between start and end with linear ease');
  t.end();
});
