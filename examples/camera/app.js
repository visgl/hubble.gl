import React, {useState, useRef, useEffect, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import {useNextFrame, BasicControls, ResolutionGuide, useDeckAdapter} from '@hubble.gl/react';
import {animation} from './layers';
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

const dimension = {
  width: 640,
  height: 480
};

const aaEffect = new PostProcessEffect(fxaa, {});
const vignetteEffect = new PostProcessEffect(vignette, {});

function filterCamera(viewState) {
  const exclude = ['width', 'height', 'altitude'];
  return Object.keys(viewState)
    .filter(key => !exclude.includes(key))
    .reduce((obj, key) => {
      obj[key] = viewState[key];
      return obj;
    }, {});
}

export default function App() {
  const deckRef = useRef(null);
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const [busy, setBusy] = useState(false);
  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(
    animation,
    INITIAL_VIEW_STATE
  );
  const [viewStateA, setViewStateA] = useState(cameraFrame);
  const [viewStateB, setViewStateB] = useState({
    ...cameraFrame,
    zoom: cameraFrame.zoom + 1,
    pitch: cameraFrame.pitch + 37
  });

  const onNextFrame = useNextFrame();

  useEffect(() => {
    adapter.animationManager.setKeyframes('deck', {
      cameraKeyframe: {
        width: dimension.width,
        height: dimension.height,
        timings: [0, timecode.end - 250],
        keyframes: [viewStateA, viewStateB],
        easings: easing.easeInOut
      }
    });
  }, [viewStateA, viewStateB]);

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
        viewState={cameraFrame}
        onViewStateChange={({viewState: vs}) => {
          setCameraFrame(vs);
        }}
        controller={true}
        effects={[vignetteEffect, aaEffect]}
        width={dimension.width}
        height={dimension.height}
        layers={layers}
        {...adapter.getProps({deck, onNextFrame})}
      />
      <div style={{position: 'absolute'}}>
        <BasicControls
          adapter={adapter}
          busy={busy}
          setBusy={setBusy}
          formatConfigs={formatConfigs}
          timecode={timecode}
        />
        <button onClick={() => setViewStateA(filterCamera(cameraFrame))}>Set Camera Start</button>
        <button onClick={() => setViewStateB(filterCamera(cameraFrame))}>Set Camera End</button>
      </div>
    </div>
  );
}
