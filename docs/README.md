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

To create an animation and render you will need to first create a [deck.gl](https://deck.gl/docs/get-started/getting-started) or [kepler.gl](https://docs.kepler.gl/#basic-usage) project. Then you will need to create a `getDeckScene` function for each scene where you'll define all of the elements of your animation, including any async data fetching.

```js
// scene.js
import {DeckScene, CameraKeyframes} from 'hubble.gl';
import {LineLayer} from '@deck.gl/layers';
import {easing} from 'popmotion';

function getLayers(scene) {
  return [
    new LineLayer({id: 'line-layer', data: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]})
  ]
}

export function getCameraKeyframes() {
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

export function getDeckScene(timeline) {
  return new DeckScene({timeline, width: 1920, height: 1080});
}
```

## Using With React

With a `sceneBuilder` in hand, create a `DeckAdapter` and choose a `FrameEncoder` for rendering a variety of video and image sequence formats. Hubble.gl provide a `useNextFrame` hook for React.js, which is used to trigger a update when necessary.

```js
// app.js
import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAdapter} from 'hubble.gl';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {getDeckScene, getCameraKeyframes} from './scene';

const timecode = {
  start: 0,
  end: 5000,
  framerate: 30
}

export default function App() {
  const deckRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const onNextFrame = useNextFrame();
  const [adapter] = useState(new DeckAdapter(getDeckScene));

  return (
    <div style={{position: 'relative'}}>
      <DeckGL
        ref={deckRef}
        {...adapter.getProps({deckRef, setReady, onNextFrame, getLayers})}
      />
      <div style={{position: 'absolute'}}>{ready && <BasicControls adapter={adapter} busy={busy} setBusy={setBusy} timecode={timecode} getCameraKeyframes={getCameraKeyframes}/>}</div>
    </div>
  );
}
```


