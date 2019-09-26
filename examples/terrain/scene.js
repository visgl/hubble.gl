import {DeckScene, CameraKeyframes, hold} from '@hubble.gl/core';
import {TerrainLayer} from '@deck.gl/geo-layers';
import {easing} from 'popmotion';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`;

// https://docs.mapbox.com/help/troubleshooting/access-elevation-data/#mapbox-terrain-rgb
// Note - the elevation rendered by this example is greatly exagerated!
const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000
};

function renderLayers(scene) {
  return [
    new TerrainLayer({
      id: 'terrain',
      minZoom: 0,
      maxZoom: 23,
      strategy: 'no-overlap',
      elevationDecoder: ELEVATION_DECODER,
      elevationData: TERRAIN_IMAGE,
      texture: SURFACE_IMAGE,
      wireframe: false,
      color: [255, 255, 255]
    })
  ];
}

function getKeyframes(animationLoop, data) {
  const camera = new CameraKeyframes({
    timings: [0, 6000, 7000, 8000, 14000],
    keyframes: [
      {
        latitude: 46.24,
        longitude: -122.18,
        zoom: 11.5,
        bearing: 140,
        pitch: 60
      },
      {
        latitude: 46.24,
        longitude: -122.18,
        zoom: 11.5,
        bearing: 0,
        pitch: 60
      },
      {
        latitude: 36.1101,
        longitude: -112.1906,
        zoom: 12.5,
        pitch: 20,
        bearing: 15
      },
      {
        latitude: 36.1101,
        longitude: -112.1906,
        zoom: 12.5,
        pitch: 20,
        bearing: 15
      },
      {
        latitude: 36.1101,
        longitude: -112.1906,
        zoom: 12.5,
        pitch: 60,
        bearing: 180
      }
    ],
    easings: [easing.easeInOut, hold, easing.easeInOut, easing.easeInOut]
  });
  animationLoop.timeline.attachAnimation(camera);

  return {
    camera
  };
}

export const sceneBuilder = animationLoop => {
  const length = 15000;
  const data = {};
  // set up keyframes
  const keyframes = getKeyframes(animationLoop, data);
  return new DeckScene({animationLoop, length, keyframes, data, renderLayers});
};
