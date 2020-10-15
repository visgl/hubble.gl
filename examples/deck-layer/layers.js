import {PathLayer, ScatterplotLayer, TextLayer, PolygonLayer} from '@deck.gl/layers';

const pathData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json';
const stationData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json';
const zipCodeData =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json';

export function renderLayers(scene) {
  // const path = scene.keyframes.path.getFrame();
  return [
    new PolygonLayer({
      id: 'polygon-layer',
      data: zipCodeData,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getPolygon: d => d.contour,
      getFillColor: d => [22, 133, 248],
      getLineColor: [61, 20, 76, 255],
      getLineWidth: 3,
      opacity: 1,
      material: {
        ambient: 1,
        diffuse: 0,
        shininess: 175,
        specularColor: [255, 255, 255]
      }
    }),
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: stationData,
      opacity: 0.9,
      stroked: false,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [...d.coordinates, 5],
      getRadius: d => 260 - Math.sqrt(d.exits),
      getFillColor: d => [233, 0, 255],
      getLineColor: d => [245, 39, 137]
    }),
    new PathLayer({
      id: 'path-layer',
      data: pathData,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: d => d.path.map(p => [...p, 20]),
      getColor: d => {
        return [250, 235, 44, 255];
      },
      getWidth: d => 2
    }),
    new TextLayer({
      id: 'text-layer',
      data: stationData,
      fontFamily: 'monospace',
      fontSettings: {
        fontSize: 100,
        sdf: true
      },
      getPosition: d => [...d.coordinates, 200],
      getText: d => d.name,
      getSize: 22,
      getAngle: 0,
      getTextAnchor: 'start',
      getAlignmentBaseline: 'center',
      getPixelOffset: [32, 0],
      getColor: [250, 235, 44, 255]
    })
  ];
}
