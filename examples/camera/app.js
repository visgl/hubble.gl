import React, {useState, useRef, useEffect, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import {useNextFrame, BasicControls, useDeckAdapter} from '@hubble.gl/react';
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
    quality: 0.8,
    archive: 'zip'
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
        width: resolution.width,
        height: resolution.height,
        timings: [0, timecode.end - 250],
        keyframes: [viewStateA, viewStateB],
        easings: easing.easeInOut
      }
    });
  }, [viewStateA, viewStateB]);

  return (
    <Container>
      <div style={{position: 'relative'}}>
        <DeckGL
          ref={deckRef}
          style={{position: 'unset'}}
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
          width={resolution.width}
          height={resolution.height}
          layers={layers}
          {...adapter.getProps({deck, onNextFrame})}
        />
      </div>
      <BasicControls
        adapter={adapter}
        busy={busy}
        setBusy={setBusy}
        formatConfigs={formatConfigs}
        timecode={timecode}
      >
        <button disabled={busy} onClick={() => setViewStateA(filterCamera(cameraFrame))}>
          Set Camera Start
        </button>
        <button disabled={busy} onClick={() => setViewStateB(filterCamera(cameraFrame))}>
          Set Camera End
        </button>
      </BasicControls>
    </Container>
  );
}
