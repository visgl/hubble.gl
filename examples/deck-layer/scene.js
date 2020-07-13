import {DeckScene, LayerKeyframes} from '@hubble.gl/core';
import {renderLayers} from './layers';
import {easing} from 'popmotion';

function getKeyframes(animationLoop, data) {
  const path = new LayerKeyframes({
    layerId: 'path-layer',
    features: ['widthScale', 'opacity'],
    timings: [0, 2500],
    keyframes: [
      {
        widthScale: 0,
        opacity: 0
      },
      {
        widthScale: 20,
        opacity: 1
      }
    ],
    easings: [easing.easeInOut]
  });
  animationLoop.timeline.attachAnimation(path);

  return {
    path
  };
}

export async function sceneBuilder(animationLoop) {
  // const data = await fetch(
  //   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json'
  // ).then(x => x.json());
  const data = {};
  const keyframes = getKeyframes(animationLoop, data);
  return new DeckScene({
    animationLoop,
    keyframes,
    data,
    renderLayers,
    lengthMs: 5000,
    width: 720,
    height: 480
  });
}
