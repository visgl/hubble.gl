/* global document */
import {Deck} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {DeckAdapter, DeckAnimation, AnimationManager, WebMEncoder} from '@hubble.gl/core';
import {easing} from 'popmotion';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 30
};

const filename = 'pure-js';

const timecode = {
  start: 0,
  end: 2000,
  framerate: 60
};

const resolution = {
  width: 640,
  height: 480
};

const animation = new DeckAnimation({
  cameraKeyframe: {
    width: resolution.width,
    height: resolution.height,
    timings: [0, timecode.end - 250],
    keyframes: [INITIAL_VIEW_STATE, {...INITIAL_VIEW_STATE, zoom: 5}],
    easings: easing.easeInOut
  }
});

const animationManager = new AnimationManager({animations: [animation]});

const adapter = new DeckAdapter({animationManager});

const formatConfigs = {
  webm: {
    quality: 0.8
  },
  jpeg: {
    quality: 0.8
  },
  gif: {
    sampleInterval: 1000
  }
};

export const deck = new Deck({
  canvas: 'deck-canvas',
  width: resolution.width,
  height: resolution.height,
  viewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [
    new GeoJsonLayer({
      id: 'base-map',
      data: COUNTRIES,
      // Styles
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      opacity: 0.4,
      getLineColor: [60, 60, 60],
      getFillColor: [200, 200, 200]
    }),
    new GeoJsonLayer({
      id: 'airports',
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: f => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: false
    }),
    new ArcLayer({
      id: 'arcs',
      data: AIR_PORTS,
      dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: f => [-0.4531566, 51.4709959], // London
      getTargetPosition: f => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1
    })
  ],
  parameters: {
    clearColor: [255, 255, 255, 1]
  }
});

adapter.setDeck(deck);

const setProps = () => {
  deck.setProps(adapter.getProps({onNextFrame: setProps}));
};

deck.setProps({
  ...adapter.getProps({onNextFrame: setProps}),
  onLoad: () => {
    adapter.render({
      Encoder: WebMEncoder,
      formatConfigs,
      timecode,
      filename,
      onComplete: setProps,
      onSave: blob => {
        document.getElementById('render-status').innerText = 'Render complete!';
        const videoElement = document.getElementById('video-render');
        videoElement.setAttribute('controls', true);
        videoElement.setAttribute('autoplay', true);
        videoElement.src = URL.createObjectURL(blob);
        videoElement.style.display = 'block';
        videoElement.addEventListener('canplaythrough', () => {
          videoElement.play();
        });
      }
    });
  }
});

animation.setOnCameraUpdate(viewState => {
  deck.setProps({viewState});
});

// For automated test cases
document.body.style.margin = '0px';
