# DeckScene

## Usage

```js
const length = 5000 // ms

const data = {
  line: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}],
  arc: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]
}

const keyframes = {
  camera: new CameraKeyframes({...})
}
// Attach each keyframe object to timeline.
animationLoop.timeline.attachAnimation(keyframes.camera);

const renderLayers = (scene) => {
  return [
    new LineLayer({ id: 'line-layer', data: scene.data.line }),
    new ArcLayer({ id: 'arc-layer', data: scene.data.arc })
  ]
}
const scene = new DeckScene({animationLoop, length, keyframes, data, renderLayers});
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

- `camera` (`CameraKeyframes`, Optional) - supply a camera animation.

- Add additional keyframe objects to the object.

Attach each individual keyframe object to the timeline with `animationLoop.timeline.attachAnimation(...)`

##### `data` (Object)

An object of data used to render layers.

##### `renderLayers` (`(scene: DeckScene) => any[]`)

A function to create deckgl layer objects provided the scene object.

## Members

##### `renderLayers`

Returns:

`Array` of deck.gl layers

## Source

[modules/core/src/scene/deck-scene.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/scene/deck-scene.js)
