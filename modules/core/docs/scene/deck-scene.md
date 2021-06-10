# DeckScene

## Usage

```js
const width = 1280;
const height = 720;

const keyframes = {
  // Camera is optional unless animating the deck.gl viewState
  camera: new CameraKeyframes({...}) // camera is a reserved key
}
// Attach each keyframe object to timeline.
timeline.attachAnimation(keyframes.camera);

// Optional unless animating deck.gl layer properties.
const data = {
  line: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}],
  arc: [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]
}
// Optional unless animating deck.gl layer properties.
const getLayers = (scene) => {
  return [
    new LineLayer({ id: 'line-layer', data: scene.data.line }),
    new ArcLayer({ id: 'arc-layer', data: scene.data.arc })
  ]
}

const scene = new DeckScene({
  timeline,  
  data,          // optional
  width,         // optional
  height         // optional
});
```

## Constructor

```js
new DeckScene({timeline, keyframes, data});
```

Parameters:

##### `timeline` (Object)

A lumagl `timeline` object.

##### `data` (Object, Optional)

An object of data used to render layers.

If set, the object is accessible in `getLayers` function via `scene.data`.

## Methods

##### `getLayers` (`((scene: DeckScene) => any[]) => any[]`)

A callback function to create deckgl layer objects provided the scene object.

Returns:

`Array` of deck.gl layers.

##### `setKeyframes` (`Object`)

Keyframe objects registered to the Timeline.

- `camera` (`CameraKeyframes`, Optional) - supply a camera animation. If set, `deck.viewState` will be set with this keyframe object.

- Add additional keyframe objects to the object.

The object is accessible in `getLayers` function via `scene.keyframes`.

## Remarks

- `camera` is a reserved object key within `keyframes`.


## Source

[modules/core/src/scene/deck-scene.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/scene/deck-scene.js)
