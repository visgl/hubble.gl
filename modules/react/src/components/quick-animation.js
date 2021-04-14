import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckScene, DeckAdapter} from '@hubble.gl/core';
import ResolutionGuide from './resolution-guide';
import BasicControls from './basic-controls';
import {useNextFrame} from '../hooks';

export const QuickAnimation = ({
  getCameraKeyframes = undefined,
  getLayerKeyframes,
  getLayers,
  initialViewState,
  duration,
  width = 640,
  height = 480,
  encoderSettings = {},
  deckProps = {}
}) => {
  const deckRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const onNextFrame = useNextFrame();

  const [viewState, setViewState] = useState(initialViewState);

  const getDeckScene = animationLoop => {
    return new DeckScene({
      animationLoop,
      lengthMs: duration,
      width,
      height,
      initialKeyframes: getLayerKeyframes()
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
      sampleInterval: 1,
      width,
      height
    },
    ...encoderSettings
  };

  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute'}}>
        <ResolutionGuide />
      </div>
      <DeckGL
        ref={deckRef}
        viewState={viewState}
        onViewStateChange={({viewState: vs}) => {
          setViewState(vs);
        }}
        controller={true}
        {...adapter.getProps({deckRef, setReady, onNextFrame, getLayers})}
        {...deckProps}
      />
      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            encoderSettings={mergedEncoderSettings}
            getCameraKeyframes={
              getCameraKeyframes ? () => getCameraKeyframes(viewState) : getCameraKeyframes
            }
            getKeyframes={getLayerKeyframes}
          />
        )}
      </div>
    </div>
  );
};
