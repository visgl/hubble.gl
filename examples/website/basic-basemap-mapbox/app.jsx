/**
 * This is based on the deckgl building example that uses the TripsLayer and PolygonLayer
 * You can find it here https://deck.gl/examples/trips-layer/
 * Source code: https://github.com/visgl/deck.gl/tree/master/examples/website/trips
 */

import React, {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import DeckGL from '@deck.gl/react';
import {BasicControls, useHubbleGl, useDeckAnimation} from '@hubble.gl/react';
import Map from 'react-map-gl';
import {PolygonLayer} from '@deck.gl/layers';
import {easeInOut} from 'popmotion';

// Source data CSV
const BUILDINGS =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json';

const material = {
  ambient: 0.8,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const START = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0,
  maxPitch: 90
};

const END = {
  latitude: 40.711793177246946,
  longitude: -74.01008557686262,
  zoom: 16.88,
  bearing: -26,
  pitch: 65,
  maxPitch: 90
};

const resolution = {
  width: 1280,
  height: 720
};

/** @type {import('@hubble.gl/core/src/types').FormatConfigs} */
const formatConfigs = {
  webm: {
    quality: 0.8
  },
  png: {
    archive: 'zip'
  },
  jpeg: {
    archive: 'zip',
    quality: 0.8
  },
  gif: {
    sampleInterval: 1000,
    width: resolution.width,
    height: resolution.height
  }
};

const timecode = {
  start: 0,
  end: 5000,
  framerate: 30
};

const Container = ({children}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#11183c',
      overflow: 'hidden'
    }}
  >
    {children}
  </div>
);

const randomColor = () => [
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255),
  Math.floor(Math.random() * 255)
];

export default function App({mapStyle = 'mapbox://styles/mapbox/streets-v11'}) {
  const deckRef = useRef(null);
  const mapRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const deckAnimation = useDeckAnimation({
    cameraKeyframe: {
      timings: [0, timecode.end],
      keyframes: [START, END],
      easings: [easeInOut],
      interpolators: 'flyTo',
      width: resolution.width,
      height: resolution.height
    },
    getLayers: a =>
      a.applyLayerKeyframes([
        new PolygonLayer({
          id: 'buildings',
          data: BUILDINGS,
          extruded: true,
          wireframe: false,
          opacity: 0.5,
          getPolygon: f => f.polygon,
          getElevation: f => f.height,
          getFillColor: randomColor,
          material,
          elevationScale: 1
        })
      ]),
    layerKeyframes: [
      {
        id: 'buildings',
        timings: [0, timecode.end],
        keyframes: [{elevationScale: 0.1}, {elevationScale: 1}],
        easings: [easeInOut]
      }
    ]
  });

  const {deckProps, mapProps, adapter, cameraFrame, setCameraFrame} = useHubbleGl({
    deckRef,
    mapRef,
    deckAnimation,
    initialViewState: START
  });

  const onViewStateChange = ({viewState}) => setCameraFrame(viewState);
  useEffect(() => onViewStateChange({viewState: cameraFrame}), []);

  return (
    <Container>
      <div style={{position: 'relative'}}>
        <DeckGL
          ref={deckRef}
          style={{position: 'unset'}}
          controller={true}
          viewState={cameraFrame}
          onViewStateChange={onViewStateChange}
          width={resolution.width}
          height={resolution.height}
          {...deckProps}
        >
          {mapProps.gl && (
            <StaticMap
              ref={mapRef}
              mapStyle={mapStyle}
              {...mapProps}
              // Note: 'reuseMap' prop with gatsby and mapbox extension causes stale reference error.
            />
          )}
        </DeckGL>
      </div>
      <BasicControls
        adapter={adapter}
        busy={busy}
        setBusy={setBusy}
        formatConfigs={formatConfigs}
        timecode={timecode}
      />
    </Container>
  );
}

export async function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);
}
