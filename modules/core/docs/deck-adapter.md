# DeckAdapter

## Constructor

```js
new DeckAdapter(sceneBuilder);
```

## Parameters

##### `sceneBuilder` (`(animationLoop) => Promise<DeckScene> | DeckScene`)

Function to build scene, async or sync. See [DeckScene](/modules/core/docs/scene/deck-scene) for more information.

```js
async function sceneBuilder(animationLoop) {
  // See DeckScene API Reference for more info
  const data = await fetch(...)
  const keyframes = {}
  const renderLayers = ...
  const lengthMs = 5000 // ms
  const width = 1920 // px
  const height = 1080 // px
  return new DeckScene({animationLoop, keyframes, data, renderLayers, lengthMs, width, height})
}
```

## Methods

##### `getProps(deckRef, setReady, onNextFrame): props`

Supplies deck.gl properties from hubble.gl.

Parameters:

* `deckRef` (`React.RefObject`) - React ref eventually containing a `deck` object.

* `setReady` (`(ready: boolean) => void`) - Callback indicating webgl, scene, and deck are loaded. Scene is ready for rendering.

* `onNextFrame` (`(nextTimeMs: number) => void`) - Callback indicating the next frame in a rendering should be displayed.

##### `render(Encoder, encoderSettings, onStop, updateCamera)`

Start rendering.

Parameters:

* **`Encoder` (`typeof FrameEncoder`, Optional) - Default: `PreviewEncoder`.**

Provide a FrameEncoder class for capturing deck canvas. See [Encoders Overview](/modules/core/docs/encoder) for options.

* **`encoderSettings` (`Object`, Optional) - Default: `{}`.**

See [FrameEncoder](/modules/core/docs/encoder/frame-encoder#constructor-1) for internal defaults.

* **`onStop` (`() => void`, Optional) - Default: `undefined`.**

This function is called after the last frame is rendered. It does not get called when a render is interrupted with `stop()`.

* **`updateCamera` (`(prevCamera: CameraKeyframes) => void`, Optional) - Default: `undefined`.**

This function is called just prior to rendering. This is useful for redefining the camera's keyframes during an apps lifecycle in response to users interacting with the map.

##### `stop(callback)`

Interrupt rendering and saves partial result. This is useful for handling user interruptions.

Parameters:

* `callback` (`() => void`, Optional) - Callback indicating the rendering is finished.

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
