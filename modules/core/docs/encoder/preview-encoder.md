# PreviewEncoder

A utility encoder is used to quickly preview animations in the browser that inherits [FrameEncoder](/modules/core/docs/encoder/frame-encoder). It doesn't produce file artifacts or capture the canvas.

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/modules/core/docs/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

# Usage

```js
import {DeckAdapter, PreviewEncoder} from '@hubble.gl/core'
const adapter = new DeckAdapter(sceneBuilder);

adapter.render(PreviewEncoder);
```

## Source

[modules/core/src/encoders/utils/preview-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/utils/preview-encoder.js)