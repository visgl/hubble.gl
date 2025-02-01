/**
 * This is based on the deckgl building example that uses the TripsLayer and PolygonLayer
 * You can find it here https://deck.gl/examples/trips-layer/
 * Source code: https://github.com/visgl/deck.gl/tree/master/examples/website/trips
 */

import React, {useState, useRef, useEffect, useCallback, forwardRef, ForwardedRef} from 'react';
import {createRoot} from 'react-dom/client';
import {BasicControls, useHubbleGl, useDeckAnimation} from '@hubble.gl/react';
import {AmbientLight, PointLight, LightingEffect, Deck} from '@deck.gl/core/typed';
import {MapboxOverlay, MapboxOverlayProps} from '@deck.gl/mapbox/typed';
import Map, {MapRef, useControl} from 'react-map-gl/maplibre';
import {PolygonLayer} from '@deck.gl/layers/typed';
import {TripsLayer} from '@deck.gl/geo-layers/typed';
import {setRef} from './set-ref';

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

const DeckGLOverlay = forwardRef<Deck, MapboxOverlayProps>(
  (props: MapboxOverlayProps, ref: ForwardedRef<Deck>) => {
    // MapboxOverlay handles a variety of props differently than the Deck class.
    // https://deck.gl/docs/api-reference/mapbox/mapbox-overlay#constructor
    const deck = useControl<MapboxOverlay>(() => new MapboxOverlay({...props, interleaved: true}));

    deck.setProps(props);

    // @ts-expect-error private property
    setRef(ref, deck._deck);
    return null;
  }
);

export default function App({mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'}) {
  const deckRef = useRef<Deck>(null);
  const mapRef = useRef<MapRef>(null);
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
        timings: [700, timecode.end],
        keyframes: [{currentTime: 700}, {currentTime: 1800}]
      }
    ]
  });

  const {deckProps, mapProps, adapter, cameraFrame, setCameraFrame} = useHubbleGl<MapRef>({
    deckRef,
    mapRef,
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
        <Map
          ref={mapRef}
          mapStyle={mapStyle}
          {...mapProps}
          {...cameraFrame}
          style={{width: resolution.width, height: resolution.height}}
          onMove={onViewStateChange}
          // Note: 'reuseMap' prop with gatsby and mapbox extension causes stale reference error.
        >
          <DeckGLOverlay 
            ref={deckRef} 
            {...deckProps} 
            effects={DEFAULT_THEME.effects} 
          />
        </Map>
      </div>
      <BasicControls
        adapter={adapter}
        busy={busy}
        setBusy={setBusy}
        formatConfigs={formatConfigs}
        timecode={timecode}
        filename="trips"
      />
    </Container>
  );
}

export async function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);
}
