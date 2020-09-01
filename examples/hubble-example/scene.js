import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

export async function sceneBuilder(animationLoop, defaultViewState) {
  console.log("state", defaultViewState);
  const keyframes = {
    camera: new CameraKeyframes({
      timings: [0, 5000],
      keyframes: [
        {
          longitude: defaultViewState.longitude,
          latitude: defaultViewState.latitude,
          zoom: 11,
          pitch: 30,
          bearing: 0
        },

        {
          longitude: defaultViewState.longitude,
          latitude: defaultViewState.latitude,
          zoom: 11.8,
          bearing: 35,
          pitch: 45 // up to 45/50
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
    width: 640,
    height: 480
  });
}
