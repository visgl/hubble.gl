import React, {useState, useRef, useCallback} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAdapter, DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {useNextFrame, BasicControls, ResolutionGuide} from '@hubble.gl/react';
import {getLayers, getKeyframes} from './layers';
import {vignette, fxaa} from '@luma.gl/shadertools';
import {PostProcessEffect, MapView} from '@deck.gl/core';
import {easing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.435,
  latitude: 37.753,
  zoom: 10,
  pitch: -37,
  bearing: 0,
  minPitch: -90,
  maxPitch: 90
};

/** @type {import('@hubble.gl/core/src/types').FrameEncoderSettings} */
const encoderSettings = {
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

const aaEffect = new PostProcessEffect(fxaa, {});
const vignetteEffect = new PostProcessEffect(vignette, {});

function filterCamera(viewState) {
  const features = ['latitude', 'longitude', 'zoom', 'bearing', 'pitch'];
  return Object.keys(viewState)
    .filter(key => features.includes(key))
    .reduce((obj, key) => {
      obj[key] = viewState[key];
      return obj;
    }, {});
}

export default function App() {
  const deckRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [viewStateA, setViewStateA] = useState(viewState);
  const [viewStateB, setViewStateB] = useState({
    ...viewState,
    zoom: viewState.zoom + 1,
    pitch: viewState.pitch + 37
  });

  const onNextFrame = useNextFrame();

  const getCameraKeyframes = useCallback(() => {
    return new CameraKeyframes({
      timings: [0, timecode.end - 250],
      keyframes: [viewStateA, viewStateB],
      easings: easing.easeInOut
    });
  }, [viewStateA, viewStateB]);

  const getDeckScene = animationLoop => {
    return new DeckScene({
      animationLoop,
      width: 640,
      height: 480,
      initialKeyframes: getKeyframes()
    });
  };

  const [adapter] = useState(new DeckAdapter(getDeckScene));

  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute'}}>
        <ResolutionGuide />
      </div>
      <DeckGL
        ref={deckRef}
        views={new MapView({farZMultiplier: 3})}
        parameters={{
          depthTest: false,
          clearColor: [61 / 255, 20 / 255, 76 / 255, 1]
          // blend: true,
          // blendEquation: GL.FUNC_ADD,
          // blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
        }}
        viewState={viewState}
        onViewStateChange={({viewState: vs}) => {
          setViewState(vs);
        }}
        controller={true}
        effects={[vignetteEffect, aaEffect]}
        {...adapter.getProps({deckRef, setReady, onNextFrame, getLayers})}
      />
      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            encoderSettings={encoderSettings}
            timecode={timecode}
            getCameraKeyframes={getCameraKeyframes}
            getKeyframes={getKeyframes}
          />
        )}
        <button onClick={() => setViewStateA(filterCamera(viewState))}>Set Camera Start</button>
        <button onClick={() => setViewStateB(filterCamera(viewState))}>Set Camera End</button>
      </div>
    </div>
  );
}
