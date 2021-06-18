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
new DeckScene({timeline, keyframes, cameraKeyframes});
```

Parameters:

##### `timeline` (`Object`, Optional)

Override the lumagl `timeline` object used in scene.

##### `keyframes` (`Object<string, Keyframes>`, Optional)

An initial set of keyframes. If they are static, supply them here. If the ever need to update, call `scene.setKeyframes`.

##### `cameraKeyframes` (`CameraKeyframes`, Optional)

An initial set of camera keyframes. If they are static, supply them here. If the ever need to update, call `scene.setCameraKeyframes`.

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
