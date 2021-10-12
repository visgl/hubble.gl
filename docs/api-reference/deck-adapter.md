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

##### `render({Encoder, formatConfigs, filename, timecode, onStop})`

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

* **`onStop` (`() => void`, Optional) - Default: `undefined`.**

Called when rendering and saving is finished.

##### `stop(callback)`

Interrupt rendering and saves partial result. This is useful for handling user interruptions.

Parameters:

* `callback` (`() => void`, Optional) - Callback indicating the rendering is finished.

This function is called after the last frame is rendered and a file is created for download. It does not get called when a render is interrupted with `stop()`.

##### `seek({timeMs})`

Move time to set a new position. Useful for peeking at different times in an animation without rendering.

Parameters:

* **`timeMs` (`number`)**

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
