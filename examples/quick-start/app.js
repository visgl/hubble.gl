import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAdapter, DeckScene, CameraKeyframes} from '@hubble.gl/core';
import {useNextFrame, BasicControls, ResolutionGuide} from '@hubble.gl/react';
import {layers} from './layers';
import {vignette, fxaa} from '@luma.gl/shadertools';
import {PostProcessEffect} from '@deck.gl/core';
import {easing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11,
  pitch: 30,
  bearing: 0
};

const aaEffect = new PostProcessEffect(fxaa, {});
const vignetteEffect = new PostProcessEffect(vignette, {});

const QuickAnimation = ({
  getCameraKeyframes,
  getLayerKeyframes,
  getLayers,
  initialViewState,
  duration,
  encoderSettings = {},
  deckProps = {},
  mapProps = {}
}) => {
  const deckgl = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const nextFrame = useNextFrame();

  const [viewState, setViewState] = useState(initialViewState);

  const getDeckScene = animationLoop => {
    return new DeckScene({
      animationLoop,
      lengthMs: duration,
      width: 640,
      height: 480
    });
  };

  const [adapter] = useState(new DeckAdapter(getDeckScene));

  const mergedEncoderSettings = {
    framerate: 30,
    webm: {
      quality: 0.8
    },
    jpeg: {
      quality: 0.8
    },
    gif: {
      sampleInterval: 1000
    },
    ...encoderSettings
  };

  const qlayers = getLayers(adapter);

  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute'}}>
        <ResolutionGuide />
      </div>
      <DeckGL
        ref={deckgl}
        viewState={viewState}
        onViewStateChange={({viewState: vs}) => {
          setViewState(vs);
        }}
        controller={true}
        layers={qlayers}
        {...adapter.getProps(deckgl, setReady, nextFrame)}
        {...deckProps}
      />
      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            encoderSettings={mergedEncoderSettings}
            getCameraKeyframes={getCameraKeyframes}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [duration] = useState(5000);
  const getCameraKeyframes = viewState => {
    return new CameraKeyframes({
      timings: [0, duration],
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
  };

  const getLayers = adapter => {
    return layers;
  };

  const deckProps = {
    parameters: {
      depthTest: false,
      clearColor: [61 / 255, 20 / 255, 76 / 255, 1]
      // blend: true,
      // blendEquation: GL.FUNC_ADD,
      // blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
    },
    effects: [vignetteEffect, aaEffect]
  };

  return (
    <QuickAnimation
      initialViewState={INITIAL_VIEW_STATE}
      getCameraKeyframes={getCameraKeyframes}
      getLayers={getLayers}
      deckProps={deckProps}
      duration={duration}
    />
  );
}
