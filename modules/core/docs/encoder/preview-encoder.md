# PreviewEncoder

A utility encoder is used to quickly preview animations in the browser that inherits [FrameEncoder](). It doesn't produce file artifacts or capture the canvas.

# Usage

```js
import {DeckAdapter, PreviewEncoder} from '@hubble.gl/core'
new DeckAdapter(sceneBuilder, PreviewEncoder);
```

## Source

[modules/core/src/encoders/utils/preview-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/utils/preview-encoder.js)