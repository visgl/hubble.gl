import {DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {PathLayer} from '@deck.gl/layers';
import {easing} from 'popmotion';
import {rgb} from 'd3-color';

function renderLayers(scene) {
  return [
    new PathLayer({
      id: 'path-layer',
      data: scene.data,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: d => d.path,
      getColor: d => {
        const color = rgb(d.color);
        return [color.r, color.g, color.b, 255];
      },
      getWidth: d => 5
    })
  ];
}

function getKeyframes(animationLoop, data) {
  const camera = new CameraKeyframes({
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
        zoom: 13,
        bearing: 0,
        pitch: 30
      }
    ],
    easings: [easing.easeInOut]
  });
  animationLoop.timeline.attachAnimation(camera);

  return {
    camera
  };
}

export async function sceneBuilder(animationLoop) {
  const length = 5000;
  const data = await fetch(
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json'
  ).then(x => x.json());
  const keyframes = getKeyframes(animationLoop, data);
  return new DeckScene({animationLoop, length, keyframes, data, renderLayers});
}
