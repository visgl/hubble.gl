/* global deck, hubble, document, URL */
/* eslint-disable no-unused-vars */
import 'hubble.gl/../bundle';
import * as g from 'hubble.gl/../bundle';
console.log(g);
console.log(hubble);

function createPoints(count = 10) {
  const points = [];
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      for (let z = 0; z < count; z++) {
        points.push({
          position: [x - count / 2, y - count / 2, z - count / 2],
          color: [(x / count) * 255, (y / count) * 255, (z / count) * 255]
        });
      }
    }
  }
  return points;
}

const LAYER_ID = 'point-cloud';
const DATA_ID = 'point-data';

function smoothstep(value) {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
}

const animation = new hubble.DeckAnimation({
  getLayers: ani => {
    const dataFrame = ani.layerKeyframes[DATA_ID].getFrame();
    return [
      new deck.PointCloudLayer({
        id: LAYER_ID,
        coordinateSystem: deck.COORDINATE_SYSTEM.IDENTITY,
        opacity: 0.8,
        data: createPoints(dataFrame.pointCount),
        getPosition: d => d.position,
        getColor: d => d.color,
        getNormal: [0, 0, 1],
        pointSize: 4
      })
    ];
  },
  layerKeyframes: [
    {
      id: DATA_ID,
      keyframes: [{pointCount: 1}, {pointCount: 30}],
      timings: [0, 3000],
      easings: smoothstep
    }
  ]
});

const timecode = {
  start: 0,
  end: 3000,
  framerate: 60
};

const filename = 'non-geo-example';

const animationManager = new hubble.AnimationManager({animations: [animation]});
const adapter = new hubble.DeckAdapter({animationManager});

const nonGeoExample = new deck.DeckGL({
  container: document.getElementById('non-geo'),
  mapbox: false /* disable map */,
  views: new deck.OrbitView({
    // most video formats don't fully support transparency
    clearColor: [255, 255, 255, 1]
  }),
  initialViewState: {distance: 1, fov: 50, rotationX: 10, rotationOrbit: 160, zoom: 3.5},
  controller: false,
  // retina displays will double resolution
  useDevicePixels: false
});

adapter.setDeck(nonGeoExample);

const setProps = () => {
  nonGeoExample.setProps(adapter.getProps({onNextFrame: setProps}));
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
  // adapter.seek({timeMs: 0});
  adapter.render({
    Encoder: hubble.WebMEncoder,
    timecode,
    filename,
    onComplete: setProps,
    onSave: embedVideo
  });
  nonGeoExample.redraw(true);
};

nonGeoExample.setProps({
  ...adapter.getProps({onNextFrame: setProps}),
  onLoad: render
});

animation.setOnLayersUpdate(layers => nonGeoExample.setProps({layers}));

const reRenderElement = document.getElementById('re-render');
reRenderElement.onclick = render;
