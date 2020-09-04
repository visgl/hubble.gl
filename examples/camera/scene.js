import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

export async function sceneBuilder(animationLoop) {
  const keyframes = {
    camera: new CameraKeyframes({
      timings: [0, 5000],
      keyframes: [
        {
          longitude: -122.4,
          latitude: 37.74,
          zoom: 11,
          pitch: 30,
          bearing: 0
        },
        {
          longitude: -122.4,
          latitude: 37.74,
          zoom: 11.8,
          bearing: 35,
          pitch: 70
        }
      ],
      easings: [easing.easeInOut]
    })
  };

  const currentCamera = animationLoop.timeline.attachAnimation(keyframes.camera);

  return new DeckScene({
    animationLoop,
    keyframes,
    lengthMs: 5000,
    width: 640,
    height: 480,
    currentCamera
  });
}
