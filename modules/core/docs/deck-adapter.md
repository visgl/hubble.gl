# DeckAdapter

## Constructor

```js
new DeckAdapter(sceneBuilder);
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
  const lengthMs = 5000 // ms
  const width = 1920 // px
  const height = 1080 // px
  return new DeckScene({animationLoop, keyframes, data, renderLayers, lengthMs, width, height})
}
```

## Methods

##### `getProps`

Supplies deck.gl properties from hubble.gl.

Parameters:

* `deckRef` (`React.RefObject`) - React ref eventually containing a `deck` object.

* `setReady` (`(ready: boolean) => void`) - Callback indicating webgl, scene, and deck are loaded. Scene is ready for rendering.

* `onNextFrame` (`(nextTimeMs: number) => void`) - Callback indicating the next frame in a rendering should be displayed.

##### `render`

Start rendering.

Parameters:

* `Encoder` (`typeof FrameEncoder`, Optional) - Default: `PreviewEncoder`. FrameEncoder class for capturing deck canvas. See [Encoders](/docs/encoder)

* `encoderSettings` (`FrameEncoderSettings`, Optional) - Default: `{}` (See [Encoder Overview](/docs/encoder) for internal defaults)

##### `stop`

Stop rendering and save.

Parameters:

* `callback` (`() => void`, Optional) - Callback indicating the rendering is finished.

## Source

[modules/main/src/adapters/deck-adapter.js](https://github.com/uber/hubble.gl/blob/master/modules/main/src/adapters/deck-adapter.js)
