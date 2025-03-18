# JPEGSequenceEncoder

A photo sequence encoder that inherits [FrameEncoder](/docs/api-reference/encoder/frame-encoder). Saves each frame as a photo contained in a `".zip"` archive.

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/docs/api-reference/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

## FrameEncoderSettings

In addition to the [FrameEncoder](/docs/api-reference/encoder/frame-encoder) settings, these settings are available under the `jpeg` namespace.

* `quality` - See member note. Defaults to 1.0.

* `archive` - `zip`.

## Members

* `extension` - `".jpeg"`

* `mimeType` - `"image/jpeg"`

* `quality` - See [HTMLCanvasElement.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)

## Source

[modules/core/src/encoders/video/jpeg-sequence-encoder.ts](https://github.com/visgl/hubble.gl/blob/master/modules/core/src/encoders/video/jpeg-sequence-encoder.ts)