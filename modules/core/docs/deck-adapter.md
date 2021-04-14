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
  const lengthMs = 5000 // ms
  const width = 1920 // px
  const height = 1080 // px
  return new DeckScene({animationLoop, data, lengthMs, width, height})
}
```

## Methods

##### `getProps({deckRef, setReady, onNextFrame, getLayers}): props`

Supplies deck.gl properties from hubble.gl.

Parameters:

* `deckRef` (`React.RefObject`) - React ref eventually containing a `deck` object.

* `setReady` (`(ready: boolean) => void`, Optional) - Callback indicating webgl, scene, and deck are loaded. Scene is ready for rendering.

* `onNextFrame` (`(nextTimeMs: number) => void`, Optional) - Callback indicating the next frame in a rendering should be displayed.

* `getLayers` (`(scene: DeckScene) => any[]`, Optional) - Callback to construct deck.gl layers provided the scene. If set, `deck.layers` will be set to the layers returned by this function.

##### `render({getCameraKeyframes, Encoder, encoderSettings, onStop})`

Start rendering.

Parameters:

* **`getCameraKeyframes` (`() => CameraKeyframes`, Optional).**

This function is used to access the camera's keyframes, and is called just prior to rendering.

* **`Encoder` (`typeof FrameEncoder`, Optional) - Default: `PreviewEncoder`.**

Provide a FrameEncoder class for capturing deck canvas. See [Encoders Overview](/modules/core/docs/encoder) for options.

* **`encoderSettings` (`Object`, Optional) - Default: `{}`.**

See [FrameEncoder](/modules/core/docs/encoder/frame-encoder#constructor-1) for internal defaults.

* **`onStop` (`() => void`, Optional) - Default: `undefined`.**

This function is called after the last frame is rendered and a file is created for download. It does not get called when a render is interrupted with `stop()`.

##### `stop(callback)`

Interrupt rendering and saves partial result. This is useful for handling user interruptions.

Parameters:

* `callback` (`() => void`, Optional) - Callback indicating the rendering is finished.

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
