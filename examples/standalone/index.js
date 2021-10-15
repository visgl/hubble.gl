/* global deck, hubble, document */
/* eslint-disable no-unused-vars */
import 'hubble.gl/../bundle';
// import {choropleths} from '../../../examples/layer-browser/src/data-samples';

const SAMPLE_SIZE = 10;
const points = [];

for (let x = 0; x < SAMPLE_SIZE; x++) {
  for (let y = 0; y < SAMPLE_SIZE; y++) {
    for (let z = 0; z < SAMPLE_SIZE; z++) {
      points.push({
        position: [x - SAMPLE_SIZE / 2, y - SAMPLE_SIZE / 2, z - SAMPLE_SIZE / 2],
        color: [(x / SAMPLE_SIZE) * 255, (y / SAMPLE_SIZE) * 255, (z / SAMPLE_SIZE) * 255]
      });
    }
  }
}

const animation = new hubble.DeckAnimation({
  getLayers: [
    new deck.PointCloudLayer({
      id: 'pointCloud',
      coordinateSystem: deck.COORDINATE_SYSTEM.IDENTITY,
      opacity: 1,
      data: points,
      getPosition: d => d.position,
      getColor: d => d.color,
      getNormal: [0, 0, 1],
      pointSize: 10
    })
  ],
  layerKeyframes: [
    {
      id: 'pointCloud',
      keyframes: [
        {opacity: 1, pointSize: 10},
        {opacity: 1, pointSize: 10},
        {opacity: 1, pointSize: 100},
        {opacity: 1, pointSize: 10}
      ],
      timings: [0, 500, 1000, 2000]
    }
  ]
});

const timecode = {
  start: 0,
  end: 2000,
  framerate: 60
};

const filename = 'non-geo-example';

const animationManager = new hubble.AnimationManager({animations: [animation]});
const adapter = new hubble.DeckAdapter({animationManager});

const geoExample = new deck.DeckGL({
  mapboxApiAccessToken: __MAPBOX_TOKEN__, // eslint-disable-line
  container: document.getElementById('geo'),
  initialViewState: {
    longitude: -122.45,
    latitude: 37.78,
    zoom: 11,
    pitch: 30
  },
  controller: true,
  onViewStateChange: console.log, // eslint-disable-line
  layers: [
    // new deck.GeoJsonLayer({
    //   data: choropleths,
    //   extruded: true,
    //   wireframe: true,
    //   fp64: true,
    //   getElevation: d => d.properties.OBJECTID * 100,
    //   getLineColor: d => [255, 255, 255],
    //   getFillColor: d => [0, 50, 100]
    // })
  ]
});

const nonGeoExample = new deck.DeckGL({
  container: document.getElementById('non-geo'),
  mapbox: false /* disable map */,
  views: [new deck.OrbitView()],
  initialViewState: {distance: 1, fov: 50, rotationX: 45, rotationOrbit: 30, zoom: 5},
  controller: false,
  parameters: {
    clearColor: [255, 255, 255, 1]
  }
});

adapter.setDeck(nonGeoExample);

const setProps = () => {
  nonGeoExample.setProps(adapter.getProps({onNextFrame: setProps}));
};

nonGeoExample.setProps({
  ...adapter.getProps({onNextFrame: setProps}),
  onLoad: () => {
    adapter.seek({timeMs: 0});
    // nonGeoExample.redraw(true)
    // adapter.render({
    //   Encoder: hubble.WebMEncoder,
    //   timecode,
    //   filename,
    //   onComplete: setProps
    // });
  }
});

animation.setOnLayersUpdate(layers => nonGeoExample.setProps({layers}));
