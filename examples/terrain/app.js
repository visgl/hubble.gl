import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {DeckAdapter} from 'hubble.gl';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {sceneBuilder} from './scene';

const INITIAL_VIEW_STATE = {
  latitude: 46.24,
  longitude: -122.18,
  zoom: 11.5,
  bearing: 140,
  pitch: 60
};

const adapter = new DeckAdapter(sceneBuilder);

const encoderSettings = {
  animationLengthMs: 15000,
  startOffsetMs: 0,
  framerate: 15,
  webm: {
    quality: 0.8
  },
  jpeg: {
    quality: 0.8
  }
};

export default function App() {
  const deckgl = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const nextFrame = useNextFrame();

  return (
    <div style={{position: 'relative'}}>
      <DeckGL
        width={720}
        height={480}
        ref={deckgl}
        initialViewState={INITIAL_VIEW_STATE}
        {...adapter.getProps(deckgl, setReady, nextFrame)}
      />
      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            encoderSettings={encoderSettings}
          />
        )}
      </div>
    </div>
  );
}
