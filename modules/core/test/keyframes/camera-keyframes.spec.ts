// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import test from 'tape-catch';
import {CameraKeyframes, hold} from '@hubble.gl/core';
import {easeInOut} from 'popmotion';
import {toLowPrecision} from '@deck.gl/test-utils';
import {flyToInterpolator} from '@hubble.gl/core/keyframes/camera-keyframes';

/* eslint-disable max-len */
const TEST_CASES = [
  {
    title: 'throw for missing prop',
    startProps: {longitude: -122.45, latitude: 37.78, zoom: 12},
    endProps: {longitude: -74, latitude: 40.7, zoom: 11},
    shouldThrow: true
  },
  {
    title: 'transition',
    expect: {
      start: {
        width: 800,
        height: 600,
        longitude: -122.45,
        latitude: 37.78,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        ease: undefined,
        interpolate: undefined
      },
      end: {
        width: 800,
        height: 600,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        pitch: 20,
        bearing: 0,
        ease: t => t,
        interpolate: 'linear'
      }
    },
    transition: {
      0.25: {bearing: 0, pitch: 5, longitude: -122.4017, latitude: 37.78297, zoom: 7.518116},
      0.5: {bearing: 0, pitch: 10, longitude: -106.3, latitude: 38.76683, zoom: 3.618313},
      0.75: {bearing: 0, pitch: 15, longitude: -74.19253, latitude: 40.68864, zoom: 6.522422}
    }
  }
];
/* eslint-enable max-len */

test('CameraKeyframes#flyToInterpolator', t => {
  TEST_CASES.filter(testCase => testCase.transition).forEach(testCase => {
    Object.keys(testCase.transition).forEach(time => {
      const propsInTransition = flyToInterpolator(
        testCase.expect.start,
        testCase.expect.end,
        Number(time)
      );
      t.deepEqual(toLowPrecision(propsInTransition, 7), testCase.transition[time], time);
    });
  });

  t.end();
});

test('Keyframes#CameraKeyframes', t => {
  const camera = new CameraKeyframes({
    width: 1920,
    height: 1080,
    timings: [0, 5000, 20000, 40000, 42000, 47000],
    keyframes: [
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 15
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.5,
        pitch: 0,
        bearing: 0
      }
    ],
    easings: [hold, easeInOut, easeInOut, hold, easeInOut]
  });

  // Prototype API
  // camera
  //   .add(0, {})
  //   .ease(linear)
  //   .add();

  t.looseEqual(
    camera.activeFeatures,
    {latitude: true, longitude: true, zoom: true, pitch: true, bearing: true},
    'All camera features active'
  );

  t.end();
});
