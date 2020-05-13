import {KeyFrames} from '@luma.gl/addons';
import {easing} from 'popmotion';
import {hold} from '@hubble.gl/core';

export const getKeyframes = animationLoop => {
  const camera = new KeyFrames([
    // Top Down
    [
      0,
      {
        latitude: 33.98126531190238,
        longitude: -118.16116037276619,
        zoom: 15.498410355026602,
        pitch: 0,
        bearing: -85.59375,
        ease: undefined
      }
    ],
    [
      20000,
      {
        latitude: 33.98126531190238,
        longitude: -118.16116037276619,
        zoom: 11,
        pitch: 60,
        bearing: -50,
        ease: easing.easeInOut
      }
    ]

    // Southern Facing Orbit
    // [
    //   0,
    //   {
    //     latitude: 33.95945997107729,
    //     longitude: -118.15593210218731,
    //     zoom: 10.09101604065535,
    //     pitch: 59.85422303619289,
    //     bearing: 95.53125,
    //     ease: undefined,
    //   },
    // ],
    // [
    //   20000,
    //   {
    //     latitude: 33.95945997107729,
    //     longitude: -118.15593210218731,
    //     zoom: 10.09101604065535,
    //     pitch: 59.85422303619289,
    //     bearing: 150,
    //     ease: easing.linear,
    //   },
    // ],

    // South to North
    // [
    //   0,
    //   {
    //     latitude: 33.8,
    //     longitude: -118.19806945321317,
    //     zoom: 11.054607333160375,
    //     pitch: 0,
    //     bearing: 0,
    //     ease: undefined,
    //   },
    // ],
    // [
    //   20000,
    //   {
    //     latitude: 34.2,
    //     longitude: -118.19806945321317,
    //     zoom: 11.054607333160375,
    //     pitch: 0,
    //     bearing: 0,
    //     ease: easing.linear,
    //   },
    // ],

    // [
    //   0,
    //   {
    //     latitude: 33.952327275939545,
    //     longitude: -118.39360063612936,
    //     zoom: 12.479018079352688,
    //     pitch: 60,
    //     bearing: 66.375,
    //     ease: easing.easeInOut,
    //   },
    // ],
    // [
    //   7000,
    //   {
    //     latitude: 33.97413977526125,
    //     longitude: -118.23104759266033,
    //     zoom: 12.479018079352688,
    //     pitch: 60,
    //     bearing: 66.375,
    //     ease: easing.easeInOut,
    //   },
    // ],
    // [
    //   10000,
    //   {
    //     latitude: 33.97413977526125,
    //     longitude: -118.23104759266033,
    //     zoom: 12.479018079352688,
    //     pitch: 60,
    //     bearing: 66.375,
    //     ease: hold,
    //   },
    // ],
    // [
    //   13000,
    //   {
    //     latitude: 33.82463940408564,
    //     longitude: -118.34073245869706,
    //     zoom: 15.003769440215855,
    //     pitch: 56.94844844844845,
    //     bearing: 24.09375,
    //     ease: easing.easeInOut,
    //   },
    // ],
  ]);
  animationLoop.timeline.attachAnimation(camera);

  const bRadius = new KeyFrames([
    [0, {radius: 9, ease: undefined}],
    [5000, {radius: 9, ease: easing.easeInOut}],
    [7000, {radius: 9, ease: hold}]
  ]);
  animationLoop.timeline.attachAnimation(bRadius);
  const bOpacity = new KeyFrames([
    [0, {opacity: 1, ease: undefined}],
    [2000, {opacity: 1, ease: hold}],
    [6000, {opacity: 1, ease: easing.easeIn}]
  ]);
  animationLoop.timeline.attachAnimation(bOpacity);
  const aRadius = new KeyFrames([
    [0, {radius: 5, ease: undefined}],
    [5000, {radius: 5, ease: easing.easeInOut}],
    [7000, {radius: 5, ease: hold}]
  ]);
  animationLoop.timeline.attachAnimation(aRadius);
  const cRadius = new KeyFrames([
    [0, {radius: 25, ease: undefined}],
    [5000, {radius: 25, ease: easing.easeInOut}]
  ]);
  animationLoop.timeline.attachAnimation(cRadius);
  const dScale = new KeyFrames([
    [0, {elevationScale: 0, ease: undefined}],
    [7000, {elevationScale: 0, ease: hold}],
    [9000, {elevationScale: 0, ease: easing.easeInOut}]
  ]);
  animationLoop.timeline.attachAnimation(dScale);

  const dOpacity = new KeyFrames([
    [0, {opacity: 0.0, ease: undefined}],
    [1000, {opacity: 0.0, ease: hold}]
  ]);
  animationLoop.timeline.attachAnimation(dOpacity);
  const aDuration = 150000000;
  const aStart = 737572251000 + 35 * aDuration;
  const bStart = 1553883500009; // + 1000 * 60 * 60 * 8;
  // const bEnd = 1553892499997;

  const bDuration = 3 * 1000 * 60;

  const a = new KeyFrames([
    [0, [aStart + 2 * aDuration, aStart + 3 * aDuration]],
    [40000, [aStart + 32 * aDuration, aStart + 33 * aDuration]]
  ]);
  animationLoop.timeline.attachAnimation(a);

  const b = new KeyFrames([
    [0, [bStart, bStart + bDuration]],
    [40000, [bStart + 30 * bDuration, bStart + 31 * bDuration]]
  ]);
  animationLoop.timeline.attachAnimation(b);

  return {
    camera,
    a,
    b,
    bRadius,
    aRadius,
    cRadius,
    dScale,
    dOpacity,
    bOpacity
  };
};
