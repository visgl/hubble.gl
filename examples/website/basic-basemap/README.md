This is a basic basemap + deck.gl data animation utilizing [react-map-gl](https://visgl.github.io/react-map-gl/) and `PolygonLayer`.

### Usage

Copy the content of this folder to your project.

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
Sample data is stored in [deck.gl Example Data](https://github.com/visgl/deck.gl-data/tree/master/examples). To use your own data, check out
the [documentation of PolygonLayer](https://deck.gl/docs/api-reference/layers/polygon-layer).

### How to add this feature to a hubble.gl example

1. Define hubble.gl react hooks

```jsx
import React, {useRef} from 'react';
import {useDeckAnimation, useHubbleGl} from '@hubble.gl/react';

const initialViewState = {...};

function Visualization() {
  const deckRef = useRef(null);
  const mapRef = useRef(null);
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
    mapProps,          // optional, use for basemap
    adapter,           // optional, use to modify animation at run time
    cameraFrame,       // optional, use for camera animation
    setCameraFrame     // optional, use for camera animation
  } = useHubbleGl({
      deckRef,
      mapRef,          // optional, use for basemap
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

3. Define an interleaved deck.gl `MapboxOverlay`

```jsx
import {forwardRef} from 'react';
import Map, {useControl} from 'react-map-gl';
import {MapboxOverlay} from '@deck.gl/mapbox';

const DeckGLOverlay = forwardRef((props, ref) => {
  // MapboxOverlay handles a variety of props differently than the Deck class.
  // https://deck.gl/docs/api-reference/mapbox/mapbox-overlay#constructor
  const deck = useControl(() => new MapboxOverlay({...props, interleaved: true}));
  deck.setProps(props);
  ref.current = deck._deck;
  return null;
});
```


4. Add to props of the `DeckGLOverlay ` and `Map` component

```jsx
  <Map
    ref={mapRef}
    {...cameraFrame}
    style={{width: resolution.width, height: resolution.height}}
    {/* add your props before spreading hubble props */}
    {...mapProps}
  >
    <DeckGLOverlay 
      ref={deckRef} 
      {/* add your props before spreading hubble props */}
      {...deckProps}
    />
  </Map>
```
