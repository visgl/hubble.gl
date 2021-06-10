/** This is based on the deckgl building example that uses the tripsLayer and polygonLayer
 * You can find it here https://deck.gl/examples/trips-layer/
 * Source code: https://github.com/visgl/deck.gl/tree/master/examples/website/trips
 */

import React, {useState, useRef, useEffect, useCallback} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckScene, DeckAdapter, CameraKeyframes} from '@hubble.gl/core';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {StaticMap} from 'react-map-gl';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';

import {easing} from 'popmotion';

import {MapboxLayer} from '@deck.gl/mapbox';
import GL from '@luma.gl/constants';

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

/** @type {import('@hubble.gl/core/src/types').FormatConfigs} */
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

const timecode = {
  start: 0,
  end: 5000,
  framerate: 30
};

// Try to convert function to class
// React.createRef
//
// useCallback
// take onMaplOan outside of the class and call it to onMapLoans prop
// equivalent to componentDidMount
//
// useEffect
// similar to compontnetDidMount???

export default function App({
  mapStyle = 'mapbox://styles/mapbox/dark-v9',
  theme = DEFAULT_THEME,
  loopLength = 1800,
  animationSpeed = 1
}) {
  const [glContext, setGLContext] = useState();

  const deckRef = useRef(null);
  const mapRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const nextFrame = useNextFrame();

  const [time, setTime] = useState(0);
  const [animation] = useState({});
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const getDeckScene = timeline => {
    return new DeckScene({
      timeline,
      width: 1280,
      height: 720
    });
  };

  const [adapter] = useState(new DeckAdapter(getDeckScene));

  const onMapLoad = useCallback(() => {
    // Component did mount
    const map = mapRef.current.getMap();
    const deck = deckRef.current.deck;
    map.addLayer(new MapboxLayer({id: 'trips', deck}));
    map.addLayer(new MapboxLayer({id: 'buildings', deck}));
    map.addLayer(new MapboxLayer({id: 'ground', deck}));

    map.on('render', () => adapter.onAfterRender(nextFrame));
  }, []);

  const animate = () => {
    setTime(t => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const layers = [
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
      opacity: 1,
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

  const getCameraKeyframes = useCallback(() => {
    return new CameraKeyframes({
      timings: [0, timecode.end],
      keyframes: [
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing
        },
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          bearing: viewState.bearing + 180,
          pitch: viewState.pitch
        }
      ],
      easings: [easing.easeInOut]
    });
  }, [timecode.end, viewState]);

  return (
    <div style={{position: 'relative'}}>
      <DeckGL
        ref={deckRef}
        layers={layers}
        effects={theme.effects}
        controller={true}
        width={640}
        height={480}
        viewState={viewState}
        onViewStateChange={({viewState: vs}) => {
          setViewState(vs);
        }}
        {...adapter.getProps({deckRef, setReady})}
        onWebGLInitialized={setGLContext}
        parameters={{
          depthTest: true,
          // clearColor: [61 / 255, 20 / 255, 76 / 255, 1]
          blend: true,
          // blendEquation: GL.FUNC_ADD,
          blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
        }}
      >
        {glContext && (
          <StaticMap
            ref={mapRef}
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            gl={glContext}
            onLoad={onMapLoad}
          />
        )}
      </DeckGL>

      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            formatConfigs={formatConfigs}
            timecode={timecode}
            getCameraKeyframes={getCameraKeyframes}
          />
        )}
      </div>
    </div>
  );
}
