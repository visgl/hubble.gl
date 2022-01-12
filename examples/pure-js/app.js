import {Deck} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {DeckAdapter, DeckAnimation, AnimationManager, WebMEncoder} from '@hubble.gl/core';
import {easing} from 'popmotion';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson'; //eslint-disable-line
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

const POSITION_1 = {
  latitude: 53.43908116042187,
  longitude: 12.287845233145143,
  zoom: 4.874450321621229,
  bearing: 72.28125,
  pitch: 86.69082968902045,
  maxZoom: 20,
  minZoom: 0,
  maxPitch: 90,
  minPitch: 0
};

const POSITION_2 = {
  latitude: 30.024522739828146,
  longitude: -43.62384043774613,
  zoom: 1.1306811261830276,
  bearing: 8.71875,
  pitch: 30.662291717091527,
  maxZoom: 20,
  minZoom: 0,
  maxPitch: 90,
  minPitch: 0
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
    keyframes: [POSITION_1, POSITION_2],
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
  viewState: POSITION_1,
  onViewStateChange: ({viewState}) => {
    deck.setProps({viewState});
  },
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
  // most video formats don't fully support transparency
  parameters: {
    clearColor: [255, 255, 255, 1]
  },
  // retina displays will double resolution
  useDevicePixels: false
});

adapter.setDeck(deck);

const setProps = () => {
  deck.setProps(adapter.getProps({onNextFrame: setProps}));
};

const embedVideo = blob => {
  document.getElementById('render-status').innerText = 'Render complete!';
  const resultElement = document.getElementById('result');
  resultElement.style.display = 'block';
  const videoElement = document.getElementById('video-render');
  videoElement.setAttribute('controls', true);
  videoElement.setAttribute('autoplay', true);
  videoElement.src = URL.createObjectURL(blob);
  videoElement.addEventListener('canplaythrough', () => {
    videoElement.play();
  });
};

const render = () => {
  adapter.render({
    Encoder: WebMEncoder,
    formatConfigs,
    timecode,
    filename,
    onComplete: setProps,
    onSave: embedVideo
  });
  deck.redraw(true);
};

deck.setProps({
  ...adapter.getProps({onNextFrame: setProps}),
  onLoad: render
});

animation.setOnCameraUpdate(viewState => {
  deck.setProps({viewState});
});

// read keyframes
const printCamera = () => {
  const cameraOne = document.getElementById('camera-1');
  const cameraTwo = document.getElementById('camera-2');
  const {cameraKeyframe} = adapter.animationManager.getKeyframes('deck');
  cameraOne.innerText = JSON.stringify(cameraKeyframe.keyframes[0], undefined, 2);
  cameraTwo.innerText = JSON.stringify(cameraKeyframe.keyframes[1], undefined, 2);
};
printCamera();

// update camera keyframes using buttons
function filterCamera(viewState) {
  const exclude = ['width', 'height', 'altitude'];
  return Object.keys(viewState)
    .filter(key => !exclude.includes(key))
    .reduce((obj, key) => {
      obj[key] = viewState[key];
      return obj;
    }, {});
}

const updateCamera = index => {
  const {cameraKeyframe} = adapter.animationManager.getKeyframes('deck');
  const keyframe = filterCamera(deck.viewManager.viewState);
  const keyframes = [...cameraKeyframe.keyframes];
  keyframes[index] = keyframe;
  adapter.animationManager.setKeyframes('deck', {
    cameraKeyframe: {
      ...cameraKeyframe,
      keyframes
    }
  });
  printCamera();
};

const updateOne = document.getElementById('update-1');
updateOne.onclick = () => updateCamera(0);

const updateTwo = document.getElementById('update-2');
updateTwo.onclick = () => updateCamera(1);

// For automated test cases
document.body.style.margin = '0px';
const reRenderElement = document.getElementById('re-render');
reRenderElement.onclick = render;
