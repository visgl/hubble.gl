# PreviewEncoder

A utility encoder is used to quickly preview animations in the browser that inherits [FrameEncoder](/docs/api-reference/encoder/frame-encoder). It doesn't produce file artifacts or capture the canvas.

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/docs/api-reference/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

# Usage

```js
import {DeckAdapter, PreviewEncoder} from '@hubble.gl/core'
const adapter = new DeckAdapter({});

adapter.render({Encoder: PreviewEncoder});
```

## Source

[modules/core/src/encoders/utils/preview-encoder.ts](https://github.com/visgl/hubble.gl/tree/1.4-release/modules/core/src/encoders/utils/preview-encoder.ts)