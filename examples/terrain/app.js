import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAdapter} from 'hubble.gl';
import {useNextFrame, BasicControls, ResolutionGuide} from '@hubble.gl/react';
import {sceneBuilder} from './scene';

import {CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';


const INITIAL_VIEW_STATE = {
  latitude: 46.24,
  longitude: -122.18,
  zoom: 11.5,
  bearing: 140,
  pitch: 60
};

const adapter = new DeckAdapter(sceneBuilder);

/** @type {import('@hubble.gl/core/src/types').FrameEncoderSettings} */
const encoderSettings = {
  framerate: 10,
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
            pitch: viewState.pitch
          }
        ],
        easings: [easing.easeInOut]
      });
   
    return prevCamera;
  }

  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute'}}>
        <ResolutionGuide />
      </div>
      <DeckGL
        ref={deckgl}
        initialViewState={INITIAL_VIEW_STATE}

        viewState={viewState}
        onViewStateChange={({viewState}) => {
          setViewState(viewState);
        }}
        controller={true}

        {...adapter.getProps(deckgl, setReady, nextFrame)}
      />
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
