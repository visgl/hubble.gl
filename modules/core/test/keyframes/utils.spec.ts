// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import test from 'tape-catch';

import {
  sanitizeEasings,
  sanitizeTimings,
  sanitizeInterpolators,
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

test('Keyframes#sanitizeInterpolators', t => {
  const keyframes = [undefined, undefined, undefined];
  const interpolators1 = ['flyTo', 'flyTo'];
  const sanitizedInterpolators1 = sanitizeInterpolators(keyframes, interpolators1);
  t.equals(sanitizedInterpolators1, interpolators1, 'valid easing array are unmodified');
  const interpolators2 = 'flyTo';
  const sanitizedInterpolators2 = sanitizeInterpolators(keyframes, interpolators2);
  t.looseEqual(
    sanitizedInterpolators2,
    interpolators1,
    'interpolators string is expanded to full interpolators array'
  );
  const interpolators3 = ['linear'];
  t.throws(
    () => sanitizeInterpolators(keyframes, interpolators3),
    'sanitizeInterpolators throws on incorrect number of easings'
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
  const interpolators1 = ['flyTo', 'linear'];
  const keyframes1 = [
    {a: '', b: true},
    {a: 'a', b: false},
    {a: '2', b: true}
  ];
  const expectedMergedKeyframes1 = [
    [0, {a: '', b: true, ease: undefined, interpolate: undefined}],
    [1, {a: 'a', b: false, ease: noop, interpolate: 'flyTo'}],
    [2, {a: '2', b: true, ease: noop, interpolate: 'linear'}]
  ];

  const actualMergedKeyframes1 = merge(timings1, keyframes1, easings1, interpolators1);

  t.looseEquals(
    actualMergedKeyframes1,
    expectedMergedKeyframes1,
    'timings, keyframes, easings, and interpolators are merged'
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
