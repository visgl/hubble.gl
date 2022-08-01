import React, {useState, useRef, useEffect} from 'react';
import DeckGL from '@deck.gl/react';
import {TerrainLayer} from '@deck.gl/geo-layers';
import {BasicControls, useHubbleGl} from '@hubble.gl/react';
import {hold, DeckAnimation} from '@hubble.gl/core';
import {easeInOut, linear} from 'popmotion';

const INITIAL_VIEW_STATE = {
  latitude: 46.24,
  longitude: -122.18,
  zoom: 11.5,
  bearing: 140,
  pitch: 60
};

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`;

// https://docs.mapbox.com/help/troubleshooting/access-elevation-data/#mapbox-terrain-rgb
// Note - the elevation rendered by this example is greatly exagerated!
const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000
};

const deckAnimation = new DeckAnimation({
  // layers are dynamically defined with setGetLayers below.
  cameraKeyframe: {
    timings: [0, 6000, 7000, 8000, 14000],
    keyframes: [
      {
        latitude: 46.24,
        longitude: -122.18,
        zoom: 11.5,
        bearing: 140,
        pitch: 60
      },
      {
        latitude: 46.24,
        longitude: -122.18,
        zoom: 11.5,
        bearing: 0,
        pitch: 60
      },
      {
        latitude: 36.1101,
        longitude: -112.1906,
        zoom: 12.5,
        pitch: 20,
        bearing: 15
      },
      {
        latitude: 36.1101,
        longitude: -112.1906,
        zoom: 12.5,
        pitch: 20,
        bearing: 15
      },
      {
        latitude: 36.1101,
        longitude: -112.1906,
        zoom: 12.5,
        pitch: 60,
        bearing: 180
      }
    ],
    easings: [easeInOut, hold, easeInOut, easeInOut]
  },
  layerKeyframes: [
    {
      id: 'terrain',
      features: ['r', 'g', 'b'],
      keyframes: [
        {r: 255, g: 255, b: 255},
        {r: 255, g: 0, b: 0},
        {r: 255, g: 255, b: 0},
        {r: 0, g: 255, b: 0},
        {r: 0, g: 255, b: 255},
        {r: 0, g: 0, b: 255},
        {r: 255, g: 0, b: 255},
        {r: 255, g: 255, b: 255}
      ],
      timings: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000],
      easings: linear
    }
  ]
});

const resolution = {
  width: 640,
  height: 480
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
  end: 15000,
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
      backgroundColor: '#11183c'
    }}
  >
    {children}
  </div>
);

export default function App() {
  const deckRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [rainbow, setRainbow] = useState(false);

  const {deckProps, adapter, cameraFrame, setCameraFrame} = useHubbleGl({
    deckRef,
    deckAnimation,
    initialViewState: INITIAL_VIEW_STATE
  });

  useEffect(() => {
    adapter.animationManager.getAnimation('deck').setGetLayers(animation => {
      const terrain = animation.layerKeyframes.terrain.getFrame();
      return [
        new TerrainLayer({
          id: 'terrain',
          minZoom: 0,
          maxZoom: 23,
          strategy: 'no-overlap',
          elevationDecoder: ELEVATION_DECODER,
          elevationData: TERRAIN_IMAGE,
          texture: rainbow ? null : SURFACE_IMAGE,
          wireframe: false,
          color: [terrain.r, terrain.g, terrain.b]
        })
      ];
    });
  }, [rainbow]);

  return (
    <Container>
      <div style={{position: 'relative'}}>
        <DeckGL
          ref={deckRef}
          style={{position: 'unset'}}
          viewState={cameraFrame}
          onViewStateChange={({viewState: vs}) => {
            setCameraFrame(vs);
          }}
          controller={false}
          width={resolution.width}
          height={resolution.height}
          {...deckProps}
        />
      </div>
      <BasicControls
        adapter={adapter}
        busy={busy}
        setBusy={setBusy}
        formatConfigs={formatConfigs}
        timecode={timecode}
      >
        <div style={{width: '100%'}}>
          <label style={{fontFamily: 'sans-serif', width: '40%', marginRight: '10%'}}>
            Rainbow Texture
          </label>
          <input type="checkbox" checked={rainbow} onChange={() => setRainbow(!rainbow)} />
        </div>
      </BasicControls>
    </Container>
  );
}
