# JPEGSequenceEncoder

A photo sequence encoder that inherits [FrameEncoder](/modules/core/docs/encoder/frame-encoder). Saves each frame as a photo contained in a `".tar"` archive.

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/modules/core/docs/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

## FrameEncoderSettings

In addition to the top level [FrameEncoder](/modules/core/docs/encoder/frame-encoder) settings, these settings are available under the `jpeg` namespace.

* `quality` - See member note. Defaults to 0.8.

## Members

* `extension` - `".jpeg"`

* `mimeType` - `"image/jpeg"`

* `quality` - See [HTMLCanvasElement.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)

## Source

[modules/core/src/encoders/video/jpeg-sequence-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/video/jpeg-sequence-encoder.js)