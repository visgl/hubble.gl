# DeckAdapter

## Constructor

```js
new DeckAdapter({animationManager, glContext});
```

## Parameters

##### `animationManager` (`AnimationManager`, Optional)

See [AnimationManager](/docs/api-reference/animations/animation-manager) for more information.

##### `glContext` (`WebGlContext`, Optional)

## Methods

##### `getProps({deck, onNextFrame, extraProps}): props`

Supplies deck.gl properties from hubble.gl.

Parameters:

* `deck` (`Deck`) - `deck` object from deck.gl.

* `onNextFrame` (`(nextTimeMs: number) => void`, Optional) - Callback indicating the next frame in a rendering should be displayed.

* `extraProps` (`DeckGlProps`, Optional) - Apply extra props to deckgl. Note: Hubble will override props as needed.

##### `render({Encoder, formatConfigs, filename, timecode, onStopped, onSave, onComplete})`

Start rendering.

Parameters:

* **`Encoder` (`typeof FrameEncoder`, Optional) - Default: `PreviewEncoder`.**

Provide a FrameEncoder class for capturing deck canvas. See [Encoders Overview](/docs/api-reference/encoder) for options.

* **`formatConfigs` (`Object`, Optional) - Default: `{}`.**

See [FrameEncoder](/docs/api-reference/encoder/frame-encoder#constructor-1) for internal defaults.

* **`timecode` (`{start: number, end: number, framerate: number}`)**

The start and end time in milliseconds to render, as well as a framerate.
          
* **`filename` (`string`, Optional) - Default: UUID.**

The video filename.

* **`onStopped` (`() => void`, Optional) - Default: `undefined`.**

Called when recording has stopped, and before saving is complete. This does not get called when a render is interrupted with `stop()`.

* **`onSave` (`(blob: Blob) => void`, Optional) - Default: `undefined`.**

Override the save function. By defualt a file will be downloaded using the given `filename`, and encoder's extension. This does not get called when a render is interrupted with `stop()`.

You may also access the download function with `adapter.videoCapture.download(blob)`.

* **`onComplete` (`() => void`, Optional) - Default: `undefined`.**

Called when rendering and saving is finished. This does not get called when a render is interrupted with `stop()`.

##### `stop({onStopped, onSave, onComplete}})`

Interrupt rendering and saves partial result. This is useful for handling user interruptions.

Parameters:

* **`onStopped` (`() => void`, Optional) - Default: `undefined`.**

Called when recording has stopped, and before saving is complete.

* **`onSave` (`(blob: Blob) => void`, Optional) - Default: `undefined`.**

Override the save function. By defualt a file will be downloaded using the given `filename`, and encoder's extension.

You may also access the download function with `adapter.videoCapture.download(blob)`.

* **`onComplete` (`() => void`, Optional) - Default: `undefined`.**

Called when rendering and saving is finished.

##### `seek({timeMs})`

Move time to set a new position. Useful for peeking at different times in an animation without rendering.

Parameters:

* **`timeMs` (`number`)**

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
