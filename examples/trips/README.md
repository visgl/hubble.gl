This is a minimal standalone version of the [TripsLayer example](https://deck.gl/examples/trips-layer/)
on [deck.gl](http://deck.gl) website.

### Purpose

Users can drag, zoom in and zoom out, change pitch and bearing from within the deckgl canvas. The camera will start at the last position (viewState) the user was at, improving the experience of exporting the camera movements.

![](https://user-images.githubusercontent.com/26909101/92542712-25c01d00-f20f-11ea-9aee-1bc2806685dc.gif)

### Usage

Copy the content of this folder to your project. 

To see the base map, you need a [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). You can either set an environment variable:

```bash
export MapboxAccessToken=<mapbox_access_token>
```

Or set `MAPBOX_TOKEN` directly in `app.js`.

Other options can be found at [using with Mapbox GL](../../../docs/get-started/using-with-mapbox-gl.md).

### Installation

```bash
# install dependencies within hubble.gl root
npm install
# or
yarn
yarn bootstrap
# To install example go to the folder 
cd examples/trips
# do this once per example
yarn 
# To run the example
yarn start-local
```

### Data format
Sample data is stored in [deck.gl Example Data](https://github.com/visgl/deck.gl-data/tree/master/examples/trips). To use your own data, check out
the [documentation of TripsLayer](../../../docs/layers/trips-layer.md).

### How to add this feature to a hubble.gl example

1. Add to props of the `DeckGl `component


```
  viewState={viewState}
  onViewStateChange={({viewState}) => {
    setViewState(viewState);
  }}
  controller={true}
```

1.1 Add the `viewState` state to App.js

```
    	  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
```

2. Add the prop method `getCameraKeyframes` to `BasicControls `component

```
getCameraKeyframes={getCameraKeyframes}
```

3. Add the method to start the camera from the current `viewState `

```
const getCameraKeyframes = () => {
  return new CameraKeyframes({
    timings: [0, 5000],
    keyframes: [
      {
        longitude: viewState.longitude,
        latitude: viewState.latitude,
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing
      },
      {
        longitude: viewState.longitude,
        latitude: viewState.latitude,
        zoom: viewState.zoom,
        bearing: viewState.bearing + 92,
        pitch: viewState.pitch // up to 50
      }
    ],
    easings: [easing.easeInOut]
  });
}
```
3.1. Imports

```
  import {CameraKeyframes} from '@hubble.gl/core';
  import {easing} from 'popmotion';
```
