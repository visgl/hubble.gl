# Introduction

Hubble.gl is a JavaScript library for animating and video encoding WebGL data visualizations.

- **High Quality Video:** 60+fps framerates, up to 8k resolution, and a variety of formats. Render a quick draft or with loseless encoding. Fine tune timing and look with keyframe markers and render everything in the same app.

- **Easy Integration:** Define animations for deck.gl or kepler.gl features, then render videos. Integrate with React UI components to interact with animation and rendering settings.

- **Client Side Library:** Videos render and encode directly in the web browser. User data never leaves their machine. Since nothing runs on a server, sites can scale without computation costs.

## Flavors

### Script Tag

```
<script src="https://unpkg.com/hubble.gl@latest/dist.min.js"></script>
```

- [Standalone example](https://github.com/visgl/hubble.gl/tree/-release/examples/standalone)

### NPM Module

```
npm install hubble.gl
```

#### Pure JS

- [Pure JS example](https://github.com/visgl/hubble.gl/tree/-release/examples/get-started/pure-js)

#### React

- [Get started](https://github.com/visgl/hubble.gl/tree/-release/examples/website/camera)

- [With basemap](https://github.com/visgl/hubble.gl/tree/-release/examples/website/trips)

## Basic Animation

To create an animation and render it you will need to first create a [deck.gl](https://deck.gl/docs/get-started/getting-started) project. Then create a `DeckAnimation`, a `timecode` object, and define some keyframes (e.g. `cameraKeyframes`)

Hubble.gl provide a `useNextFrame` hook for React.js to trigger a render when necessary, and provides the `<BasicControls/>` component for convenience to get your animation started.

```js
import React, {useState, useRef, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {DeckAnimation} from 'hubble.gl';
import {easeInOut} from 'popmotion';

const deckAnimation = new DeckAnimation({
  // Use applyLayerKeyframes to spread keyframe values onto layers by id.
  getLayers: (a) => a.applyLayerKeyframes([
    new LineLayer({
      id: 'line-layer', 
      data: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]
    })
  ]),
  layerKeyframes: [
    { 
      id: 'line-layer',  
      timings: [0, 1000], 
      keyframes: [{opacity: 0}, {opacity: 1}] 
    }
  ],
  cameraKeyframe: {
    timings: [0, 5000], // ms
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
    easings: easeInOut // any easing number => number function is supported
  }
});

const timecode = {
  start: 0,      // ms
  end: 5000,     // ms
  framerate: 30
}

const resolution = {
  width: 1920,  // px
  height: 1080  // px
}

export default function App() {
  const deckRef = useRef(null);
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const [busy, setBusy] = useState(false);
  const nextFrame = useNextFrame();

  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(deckAnimation);
  
  return (
    <div style={{position: 'relative'}}>
      <DeckGL
        ref={deckRef}
        viewState={cameraFrame}
        onViewStateChange={({viewState}) => setCameraFrame(viewState)}
        width={resolution.width}
        height={resolution.height}
        {...adapter.getProps({deck, nextFrame})}
      />
      <div style={{position: 'absolute'}}>
        <BasicControls 
          adapter={adapter}
          busy={busy}
          setBusy={setBusy}
          formatConfigs={formatConfigs}
          timecode={timecode}
        />
      </div>
    </div>
  );
}
```
