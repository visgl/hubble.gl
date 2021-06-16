# Introduction

Hubble.gl is a JavaScript library for animating data visualizations.

- **High Quality Video:** Guaranteed smooth framerates, high resolutions, and a variety of formats. Render the quality you want at the speed you need it. Fine tune timing and look with keyframe markers and render everything in the same app.

- **Easy Integration:** Stand up scenes within deck.gl or kepler.gl, then animate any aspect of it. Empower users to animate without code with UI components included in this library.

- **Client Side Library:** Videos render and encode directly in the web browser. User data never leaves their machine. Since nothing runs on a server, sites can scale without computation costs.

## Installation

```
npm install hubble.gl
```

## Basic Scene

To create an animation and render it you will need to first create a [deck.gl](https://deck.gl/docs/get-started/getting-started) project. Then create a `DeckAdapter` and `DeckScene`, a `timecode` object, and define some keyframes (e.g. `CameraKeyframes`)

Hubble.gl provide a `useNextFrame` hook for React.js to trigger a render when necessary, and provides the `<BasicControls/>` component for convenience to get your animation started.

```js
import React, {useState, useRef, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {DeckScene, DeckAdapter, CameraKeyframes} from 'hubble.gl';
import {easing} from 'popmotion';

const timecode = {
  start: 0,      // ms
  end: 5000,     // ms
  framerate: 30
}

const adapter = new DeckAdapter(new DeckScene({width: 1920, height: 1080}));

function getCameraKeyframes() {
  return new CameraKeyframes({
    timings: [0, 5000],
    keyframes: [
      {
        latitude: 37.7853,
        longitude: -122.41669,
        zoom: 11.5,
        bearing: 140,
        pitch: 60
      },
      {
        latitude: 37.7853,
        longitude: -122.41669,
        zoom: 11.5,
        bearing: 0,
        pitch: 30
      }
    ],
    easings: [easing.easeInOut]
  });
}

function getLayers(scene) {
  return [
    new LineLayer({id: 'line-layer', data: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]})
  ]
}

export default function App() {
  const deckRef = useRef(null);
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const [busy, setBusy] = useState(false);
  const onNextFrame = useNextFrame();
  
  return (
    <div style={{position: 'relative'}}>
      <DeckGL
        ref={deckRef}
        {...adapter.getProps({deck, onNextFrame, getLayers})}
      />
      <div style={{position: 'absolute'}}>
        <BasicControls adapter={adapter} busy={busy} setBusy={setBusy} timecode={timecode} getCameraKeyframes={getCameraKeyframes}/>
      </div>
    </div>
  );
}
```


