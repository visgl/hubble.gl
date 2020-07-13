# DeckScene

## Usage

```js
const length = 5000 // ms

const keyframes = {
  // Camera is optional unless animating the deck.gl viewState
  camera: new CameraKeyframes({...}) // camera is a reserved key
}
// Attach each keyframe object to timeline.
animationLoop.timeline.attachAnimation(keyframes.camera);

// Optional unless animating deck.gl layer properties.
const data = {
  line: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}],
  arc: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]
}
// Optional unless animating deck.gl layer properties.
const renderLayers = (scene) => {
  return [
    new LineLayer({ id: 'line-layer', data: scene.data.line }),
    new ArcLayer({ id: 'arc-layer', data: scene.data.arc })
  ]
}

const scene = new DeckScene({
  animationLoop,  
  length, 
  keyframes, 
  data,          // optional
  renderLayers   // optional
});
```

## Constructor

```js
new DeckScene({animationLoop, length, keyframes, data, renderLayers});
```

Parameters:

##### `animationLoop` (Object)

A deckgl `animationLoop` object.

##### `length` (Number)

Total length of scene in milliseconds.

##### `keyframes` (Object)

Keyframe objects registered to the animationLoop timeline.

- `camera` (`CameraKeyframes`, Optional) - supply a camera animation. If set, `deck.viewState` will be set with this keyframe object.

- Add additional keyframe objects to the object.

Attach each individual keyframe object to the timeline with `animationLoop.timeline.attachAnimation(...)`

##### `data` (Object, Optional)

An object of data used to render layers.

If set, the object is accessible in `renderLayers` function via `scene.data`.

##### `renderLayers` (`(scene: DeckScene) => any[]`, Optional)

* Default: `undefined`

A function to create deckgl layer objects provided the scene object after it is constructed.

If set, `deck.layers` will be set to the layers returned by this function.

## Methods

##### `renderLayers`

Returns:

If constructed with `renderLayers` parameter it returns `Array` of deck.gl layers, otherwise returns `undefined`

##### `hasLayers`

Returns:

`Boolean` where `true` when constructed with `renderLayers` parameter, otherwise false.

## Remarks

- Individual keyframe objects must be attached to the timeline prior to recording with `animationLoop.timeline.attachAnimation(...)`.
- `camera` is a reserved object key within `keyframes`.


## Source

[modules/core/src/scene/deck-scene.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/scene/deck-scene.js)
