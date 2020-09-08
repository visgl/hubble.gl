import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

// Default Keyframes
export async function sceneBuilder(animationLoop) {
  const keyframes = {
    camera: new CameraKeyframes({
      timings: [0, 5000],
      keyframes: [
        {
          longitude: -74,
          latitude: 40.72,
          zoom: 11,
          pitch: 30,
          bearing: 0
        },

        {
          longitude: -74,
          latitude: 40.72,
          zoom: 11.8,
          bearing: 35,
          pitch: 45 // up to 45/50
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
    width: 1280,
    height: 720,
    currentCamera
  });
}
