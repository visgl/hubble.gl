# GifEncoder

A GIF animated photo format encoder that inherits [FrameEncoder](/modules/core/docs/encoder/frame-encoder).

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/modules/core/docs/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

## FrameEncoderSettings

In addition to the top level [FrameEncoder](/modules/core/docs/encoder/frame-encoder) settings, these settings are available under the `gif` namespace.

* `width` - The width in pixels the GIF is scaled to. Defaults to 720.

* `height` - The height in pixels the GIF is scaled to. Defaults to 480.

* `numWorkers` - The number of web workers concurrently encoding frames. Defaults to 4.

* `sampleInterval` - Pixels to skip when creating the palette. Default is 10. Less is better, but slower.


## Members

* `extension` - `".gif"`

* `mimeType` - `"image/gif"`

* `options` - The object under the `gif` namespace in the [FrameEncoder](/modules/core/docs/encoder/frame-encoder) settings, see above.

## Source

[modules/core/src/encoders/video/gif-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/video/gif-encoder.js)

### Attributions

GifEncoder is a wrapper around the loaders.gl [GIFBuilder](https://loaders.gl/modules/video/docs/api-reference/gif-builder), which is under MIT license.