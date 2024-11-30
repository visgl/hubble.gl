This is a basic basemap + deck.gl data animation utilizing [react-map-gl](https://visgl.github.io/react-map-gl/) and `PolygonLayer`.

### Usage

Copy the content of this folder to your project. 

To see the base map, you need a [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). You can either set an environment variable:

```bash
export MapboxAccessToken=<mapbox_access_token>
```

Or set `MAPBOX_TOKEN` directly in `app.js`.

Other options can be found at [using with Mapbox GL](https://deck.gl/docs/developer-guide/base-maps/using-with-mapbox).

### Installation

```bash
# install dependencies within hubble.gl root
yarn bootstrap
# To install example go to the folder 
cd examples/basic-basemap
# do this once per example
yarn 
# To run the example
yarn start-local
```

### Data format
Sample data is stored in [deck.gl Example Data](https://github.com/visgl/deck.gl-data/tree/master/examples/trips). To use your own data, check out
the [documentation of PolygonLayer](https://deck.gl/docs/api-reference/layers/polygon-layer).

### How to add this feature to a hubble.gl example

1. Define hubble.gl react hooks

```jsx
import React, {useRef} from 'react';
import {useDeckAnimation, useHubbleGl} from '@hubble.gl/react';

const initialViewState = {...};

function Map() {
  const deckRef = useRef(null);
  const staticMapRef = useRef(null);
  const deckAnimation = useDeckAnimation({
    getLayers: a =>
      a.applyLayerKeyframes([
         // move deck layer definitions to here
      ]),
    layerKeyframes: ...
    cameraKeyframe: ...
  });

  const {
    deckProps, 
    staticMapProps,    // optional, use for basemap
    adapter,           // optional, use to modify animation at run time
    cameraFrame,       // optional, use for camera animation
    setCameraFrame     // optional, use for camera animation
  } = useHubbleGl({
      deckRef,
      staticMapRef,    // optional, use for basemap
      deckAnimation,
      initialViewState // optional, use for camera animation
  });
  
  ...
```

2. Define animation and export settings

```js
const formatConfigs = {
  // optional, override default quality settings
};

const resolution = {
  width: 1280,
  height: 720
};

const timecode = {
  start: 0,
  end: 5000,
  framerate: 30
};
```

3. Add to props of the `DeckGl ` and `StaticMap` component

```jsx
  <DeckGL
    ref={deckRef}
    viewState={cameraFrame}
    width={resolution.width}
    height={resolution.height}
    viewState={cameraFrame}
    {/* add your props before spreading hubble props */}
    {...deckProps}
  >
    {/* optional base map */}
    {staticMapProps.gl && (
      <StaticMap
        ref={staticMapRef}
        {/* add your props before spreading hubble props */}
        {...staticMapProps}
      />
    )}
  </DeckGL>
```
