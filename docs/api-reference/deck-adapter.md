# DeckAdapter

## Constructor

```js
new DeckAdapter({scene, glContext});
```

## Parameters

##### `scene` (`DeckScene`, Optional)

See [DeckScene](/docs/api-reference/scene/deck-scene) for more information.

##### `glContext` (`WebGlContext`, Optional)

## Methods

##### `getProps({deck, onNextFrame, getLayers, extraProps}): props`

Supplies deck.gl properties from hubble.gl.

Parameters:

* `deck` (`Deck`) - `deck` object from deck.gl.

* `onNextFrame` (`(nextTimeMs: number) => void`, Optional) - Callback indicating the next frame in a rendering should be displayed.

* `getLayers` (`(scene: DeckScene) => any[]`, Optional) - Callback to construct deck.gl layers provided the scene. If set, `deck.layers` will be set to the layers returned by this function.

* `extraProps` (`DeckGlProps`, Optional) - Apply extra props to deckgl. Note: Hubble will override props as needed.

##### `render({getCameraKeyframes, Encoder, formatConfigs, onStop, getKeyframes})`

Start rendering.

Parameters:

* **`getCameraKeyframes` (`() => CameraKeyframes`, Optional) - Default: `undefined`.**

This function is used to access the camera's keyframes, and is called just prior to rendering.

* **`getKeyframes` (`() => Object<string, Keyframes>`, Optional) - Default: `undefined`.**

This function is called after the last frame is rendered and a file is created for download. It does not get called when a render is interrupted with `stop()`.

* **`Encoder` (`typeof FrameEncoder`, Optional) - Default: `PreviewEncoder`.**

Provide a FrameEncoder class for capturing deck canvas. See [Encoders Overview](/docs/api-reference/encoder) for options.

* **`formatConfigs` (`Object`, Optional) - Default: `{}`.**

See [FrameEncoder](/docs/api-reference/encoder/frame-encoder#constructor-1) for internal defaults.

* **`timecode` (`{start: number, end: number, framerate: number}`)**

The start and end time in milliseconds to render, as well as a framerate.
          
* **`filename` (`string`, Optional) - Default: UUID.**

* **`onStop` (`() => void`, Optional) - Default: `undefined`.**

##### `stop(callback)`

Interrupt rendering and saves partial result. This is useful for handling user interruptions.

Parameters:

* `callback` (`() => void`, Optional) - Callback indicating the rendering is finished.

##### `seek({timeMs, getCameraKeyframes, getKeyframes})`

Move time to set a new position. Useful for peeking at different times in an animation without rendering.

Parameters:

* **`timeMs` (`number`)**

* **`getCameraKeyframes` (`() => CameraKeyframes`, Optional) - Default: `undefined`.**

This function is used to access the camera's keyframes, and is called just prior to rendering.

* **`getKeyframes` (`() => Object<string, Keyframes>`, Optional) - Default: `undefined`.**

This function is called after the last frame is rendered and a file is created for download. It does not get called when a render is interrupted with `stop()`.

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
