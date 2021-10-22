/** This is based on the deckgl building example that uses the tripsLayer and polygonLayer
 * You can find it here https://deck.gl/examples/trips-layer/
 * Source code: https://github.com/visgl/deck.gl/tree/master/examples/website/trips
 */

import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAnimation} from '@hubble.gl/core';
import {useNextFrame, BasicControls, useDeckAdapter} from '@hubble.gl/react';
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

const animation = new DeckAnimation({
  layers: [
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
    })
  ],
  layerKeyframes: [
    {
      id: 'trips',
      timings: [0, timecode.end],
      keyframes: [{currentTime: 0}, {currentTime: 1800}]
    }
  ]
});

const Container = ({children}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#11183c'
    }}
  >
    {children}
  </div>
);

export default function App({mapStyle = 'mapbox://styles/mapbox/dark-v9'}) {
  const [glContext, setGLContext] = useState();

  const deckRef = useRef(null);
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const mapRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const nextFrame = useNextFrame();

  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(
    animation,
    INITIAL_VIEW_STATE
  );
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
          easings: [easing.easeInOut]
        }
      });
      setCameraFrame(vs);
    },
    [timecode.end]
  );
  useEffect(() => onViewStateChange({viewState: cameraFrame}), []);

  const onMapLoad = useCallback(() => {
    if (deck) {
      const map = mapRef.current.getMap();
      map.addLayer(new MapboxLayer({id: 'trips', deck}));
      map.addLayer(new MapboxLayer({id: 'buildings', deck}));
      map.addLayer(new MapboxLayer({id: 'ground', deck}));
      map.on('render', () => adapter.onAfterRender(nextFrame));
    }
  }, [Boolean(deck)]);

  return (
    <Container>
      <div style={{position: 'relative'}}>
        <DeckGL
          ref={deckRef}
          style={{position: 'unset'}}
          layers={layers}
          effects={DEFAULT_THEME.effects}
          controller={true}
          viewState={cameraFrame}
          onViewStateChange={onViewStateChange}
          onWebGLInitialized={setGLContext}
          parameters={{
            depthTest: true,
            // clearColor: [61 / 255, 20 / 255, 76 / 255, 1]
            blend: true,
            // blendEquation: GL.FUNC_ADD,
            blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
          }}
          width={resolution.width}
          height={resolution.height}
          {...adapter.getProps({deck})}
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
