import React, {useState, useRef, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import BasicControls from './basic-controls';
import {useDeckAdapter, useNextFrame} from '../hooks';
import {DeckGLRender} from '../renderer/deckgl-renderer';

export const QuickAnimation = ({
  initialViewState,
  animation,
  timecode,
  resolution = {width: 640, height: 480},
  formatConfigs = {},
  deckProps = {}
}) => {
  const deckRef = useRef(null);
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const [busy, setBusy] = useState(false);
  const onNextFrame = useNextFrame();
  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(
    animation,
    initialViewState
  );

  const mergedFormatConfigs = {
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
      sampleInterval: 1,
      width: resolution.width,
      height: resolution.height
    },
    ...formatConfigs
  };

  const mergedTimecode = {
    framerate: 30,
    start: 0,
    ...timecode
  };

  return (
    <>
      <div style={{position: 'relative'}}>
        <DeckGLRender renderResolution={resolution}>
          {deckglStyle => (
            <DeckGL
              ref={deckRef}
              style={deckglStyle}
              viewState={cameraFrame}
              onViewStateChange={({viewState: vs}) => {
                setCameraFrame(vs);
              }}
              controller={true}
              width={resolution.width}
              height={resolution.height}
              layers={layers}
              {...adapter.getProps({deck, onNextFrame, extraProps: deckProps})}
            />
          )}
        </DeckGLRender>
      </div>
      <BasicControls
        adapter={adapter}
        busy={busy}
        setBusy={setBusy}
        formatConfigs={mergedFormatConfigs}
        timecode={mergedTimecode}
      />
    </>
  );
};
