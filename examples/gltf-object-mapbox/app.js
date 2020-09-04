import React, {useState, useRef} from 'react';
import {DeckAdapter} from 'hubble.gl';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {sceneBuilder} from './scene';

import DeckGL from '@deck.gl/react';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';

import {GLTFLoader} from '@loaders.gl/gltf';
import {registerLoaders} from '@loaders.gl/core';
import {StaticMap} from 'react-map-gl';

import {CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

registerLoaders([GLTFLoader]);

const MAPBOX_STYLE = 'https://97morningstar.github.io/dataRepo/style.json';

const GLTF_URL = '/data/out.glb';

const adapter = new DeckAdapter(sceneBuilder);

const INITIAL_VIEW_STATE = {
  longitude: 6.2410395,
  latitude: 51.8742355,
  zoom: 18,
  pitch: 60
};

const encoderSettings = {
  framerate: 30,
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

export default function App() {
  const deckgl = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const nextFrame = useNextFrame();

  console.log(deck, ready, busy, nextFrame);

  const scenegraphLayer = new ScenegraphLayer({
    id: 'scene',
    scenegraph: GLTF_URL,
    data: [
      {
        geometry: {
          type: 'Point',
          coordinates: [6.2410395, 51.8742355, -100]
        }
      }
    ],
    getPosition: f => [6.2410395, 51.8742355, -100],
    sizeScale: 12,
    getOrientation: [0, 100, 90],
    getTranslation: [97, 50, 100],
    getScale: [0.45, 0.45, 0.45]
  });

  const updateCamera = (prevCamera) => {
    // Set by User
  prevCamera = new CameraKeyframes({
        timings: [0, 5000],
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
            bearing: viewState.bearing + 92,
            pitch: viewState.pitch // up to 45/50
          }
        ],
        easings: [easing.easeInOut]
      });
   
    return prevCamera;
  }

  return (
    <div>
      <DeckGL
        ref={deckgl}
        initialViewState={INITIAL_VIEW_STATE}
        layers={[scenegraphLayer]}

        viewState={viewState}
        onViewStateChange={({viewState}) => {
          setViewState(viewState);
        }}

        controller={true}

        {...adapter.getProps(deckgl, setReady, nextFrame)}
      >
        <StaticMap
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken="pk.eyJ1IjoicGlvbmVlci1tZSIsImEiOiJjanA0OXMwM2IwcW5qM2tvYnAyYndpdXMxIn0.bqxGkqM2ozOVT57GuVzEjw"
        />
      </DeckGL>

      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            encoderSettings={encoderSettings}
            updateCamera={updateCamera}
          />
        )}
      </div>
    </div>
  );
}
