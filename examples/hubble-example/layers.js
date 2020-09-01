import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';

const pathData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json';
const stationData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json';
const zipCodeData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json';



  const DATA_URL = {
    BUILDINGS:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
    TRIPS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json' // eslint-disable-line
  };
  

export const layers = [
  new PolygonLayer({
    id: 'ground',
    data: landCover,
    getPolygon: f => f,
    stroked: false,
    getFillColor: [0, 0, 0, 0]
  }),
  new TripsLayer({
    id: 'trips',
    data: DATA_URL.TRIPS,
    getPath: d => d.path,
    getTimestamps: d => d.timestamps,
    getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
    opacity: 0.3,
    widthMinPixels: 2,
    rounded: true,
    trailLength: 180,
    currentTime: time,

    shadowEnabled: false
  }),
  new PolygonLayer({
    id: 'buildings',
    data: DATA_URL.BUILDINGS,
    extruded: true,
    wireframe: false,
    opacity: 0.5,
    getPolygon: f => f.polygon,
    getElevation: f => f.height,
    getFillColor: theme.buildingColor,
    material: theme.material
  })
];
