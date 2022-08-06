/**
 * This is based on the deckgl building example that uses the TripsLayer and PolygonLayer
 * You can find it here https://deck.gl/examples/trips-layer/
 * Source code: https://github.com/visgl/deck.gl/tree/master/examples/website/trips
 */

import React, {useState, useRef, useEffect, useCallback} from 'react';
import DeckGL from '@deck.gl/react';
import {BasicControls, useHubbleGl, useDeckAnimation} from '@hubble.gl/react';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {StaticMap} from 'react-map-gl';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';

import {easeInOut} from 'popmotion';

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json',
  TRIPS: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json'
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

const landCover = [
  [
    [-74.0, 40.7],
    [-74.02, 40.7],
    [-74.02, 40.72],
    [-74.0, 40.72]
  ]
];

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

export default function App({mapStyle = 'mapbox://styles/mapbox/dark-v9'}) {
  const deckRef = useRef(null);
  const staticMapRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const deckAnimation = useDeckAnimation({
    getLayers: a =>
      a.applyLayerKeyframes([
        new TripsLayer({
          id: 'trips',
          data: DATA_URL.TRIPS,
          getPath: d => d.path,
          getTimestamps: d => d.timestamps,
          getColor: d => (d.vendor === 0 ? DEFAULT_THEME.trailColor0 : DEFAULT_THEME.trailColor1),
          opacity: 1,
          widthMinPixels: 2,
          rounded: true,
          trailLength: 180,
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
          getFillColor: DEFAULT_THEME.buildingColor,
          material: DEFAULT_THEME.material
        }),
        new PolygonLayer({
          id: 'ground',
          data: landCover,
          getPolygon: f => f,
          stroked: false,
          getFillColor: [0, 0, 0, 0]
        })
      ]),
    layerKeyframes: [
      {
        id: 'trips',
        timings: [0, timecode.end],
        keyframes: [{currentTime: 0}, {currentTime: 1800}]
      }
    ]
  });

  const {deckProps, staticMapProps, adapter, cameraFrame, setCameraFrame} = useHubbleGl({
    deckRef,
    staticMapRef,
    deckAnimation,
    initialViewState: INITIAL_VIEW_STATE
  });

  const onViewStateChange = useCallback(
    ({viewState: vs}) => {
      adapter.animationManager.setKeyframes('deck', {
        cameraKeyframe: {
          timings: [0, timecode.end],
          keyframes: [
            {
              longitude: vs.longitude,
              latitude: vs.latitude,
              zoom: vs.zoom,
              pitch: vs.pitch,
              bearing: vs.bearing
            },
            {
              longitude: vs.longitude,
              latitude: vs.latitude,
              zoom: vs.zoom,
              bearing: vs.bearing + 180,
              pitch: vs.pitch
            }
          ],
          easings: [easeInOut]
        }
      });
      setCameraFrame(vs);
    },
    [timecode.end]
  );
  useEffect(() => onViewStateChange({viewState: cameraFrame}), []);

  return (
    <Container>
      <div style={{position: 'relative'}}>
        <DeckGL
          ref={deckRef}
          style={{position: 'unset'}}
          effects={DEFAULT_THEME.effects}
          controller={true}
          viewState={cameraFrame}
          onViewStateChange={onViewStateChange}
          width={resolution.width}
          height={resolution.height}
          {...deckProps}
        >
          {staticMapProps.gl && (
            <StaticMap
              ref={staticMapRef}
              mapStyle={mapStyle}
              {...staticMapProps}
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
