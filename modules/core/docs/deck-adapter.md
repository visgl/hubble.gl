# DeckAdapter

## Constructor

```js
new DeckAdapter(sceneBuilder, Encoder, encoderSettings);
```

## Parameters

##### `sceneBuilder` (`(animationLoop) => Promise<DeckScene> | DeckScene`)

Function to build scene, async or sync.

```js
async function sceneBuilder(animationLoop) {
  // See DeckScene API Reference for more info
  const data = await fetch(...)
  const keyframes = {}
  const renderLayers = ...
  const length = 5000 // ms
  return new DeckScene({animationLoop, length, keyframes, data, renderLayers})
}
```

##### `Encoder` (`typeof FrameEncoder`, Optional)

* Default: `PreviewEncoder`

FrameEncoder class for capturing deck canvas. See [Encoders]()

##### `encoderSettings` (`FrameEncoderSettings`, Optional)

* Default: `{}` (See `FrameEncoder` for internal defaults)

## Methods

##### `getProps`

Supplies deck.gl properties from hubble.gl.

Parameters:

* `deckRef` (`React.RefObject`) - React ref eventually containing a `deck` object.

* `setReady` (`(ready: boolean) => void`) - Callback indicating webgl, scene, and deck are loaded. Scene is ready for rendering.

* `onNextFrame` (`(nextTimeMs: number) => void`) - Callback indicating the next frame in a rendering should be displayed.

##### `update`

Call in react render when recording to request a new frame.

Parameters:

* `onNextFrame` (`(nextTimeMs: number) => void`) - Callback indicating the next frame in a rendering should be displayed.

##### `render`

Start rendering.

Parameters:

* `startTimeMs` (`number`, Optional) - Offset the animation. Defaults to 0.

##### `preview`

Preview rendering.

##### `stop`

Stop rendering and save.

Parameters:

* `callback` (`() => void`, Optional) - Callback indicating the rendering is finished.

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
