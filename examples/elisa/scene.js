import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

export async function sceneBuilder(animationLoop) {
  const data = {};
  const keyframes = {
    camera: new CameraKeyframes({
      timings: [1000, 5000],
      keyframes: [
        {
          longitude: 6.2410395,
          latitude: 51.8742355,
          zoom: 18,
          pitch: 60,
          bearing: 60
        },
        {
          longitude: 6.2410395,
          latitude: 51.8742355,
          zoom: 24,
          bearing: 100,
          pitch: 70
        }
      ],
      easings: [easing.easeInOut]
    })
  };
  animationLoop.timeline.attachAnimation(keyframes.camera);

  return new DeckScene({
    animationLoop,
    keyframes,
    lengthMs: 5000,
    data
  });
}
