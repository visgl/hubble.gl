# DeckScene

## Usage

```js
// Camera is optional unless animating the deck.gl viewState
const cameraKeyframes = new CameraKeyframes({...})

// Optional unless animating deck.gl layer properties.
const getLayers = (scene) => {
  return [
    new LineLayer({ id: 'line-layer', data: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}] }),
    new ArcLayer({ id: 'arc-layer', data: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}] })
  ]
}

const scene = new DeckScene({
  cameraKeyframes // optional
});
```

## Constructor

```js
new DeckScene({timeline, layerKeyframes, cameraKeyframes});
```

Parameters:

##### `timeline` (`Object`, Optional)

Override the lumagl `timeline` object used in scene.

##### `layerKeyframes` (`Object<string, Keyframes>`, Optional)

An initial set of layer keyframes. If they are static, supply them here. If the ever need to update, call `scene.setLayerKeyframes`.

##### `cameraKeyframes` (`CameraKeyframes`, Optional)

An initial set of camera keyframes. If they are static, supply them here. If the ever need to update, call `scene.setCameraKeyframes`.

## Methods

##### `setLayerKeyframes` (`Object<string, Keyframes>`)

Keyframe objects registered to the Timeline.

##### `setCameraKeyframes` (`CameraKeyframes`)

Supply a camera animation. If set, `deck.viewState` will be set with this keyframe object.

## Source

[modules/core/src/scene/deck-scene.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/scene/deck-scene.js)
