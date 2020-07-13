import {DeckScene, LayerKeyframes} from '@hubble.gl/core';
import {PathLayer} from '@deck.gl/layers';
import {easing} from 'popmotion';
import {rgb} from 'd3-color';

function renderLayers(scene) {
  const path = scene.keyframes.path.getFrame();
  return [
    new PathLayer({
      id: 'path-layer',
      data: scene.data,
      widthScale: path.widthScale,
      opacity: path.opacity,
      widthMinPixels: 2,
      getPath: d => d.path,
      getColor: d => {
        const color = rgb(d.color);
        return [color.r, color.g, color.b, 255];
      },
      getWidth: d => 5,
      updateTriggers: {
        widthScale: path.widthScale,
        opacity: path.opacity
      }
    })
  ];
}

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
  const data = await fetch(
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json'
  ).then(x => x.json());
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
