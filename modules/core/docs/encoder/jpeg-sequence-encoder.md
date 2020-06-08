# JPEGSequenceEncoder

A photo sequence encoder that inherits [TarEncoder](). Saves each frame as a photo contained in a `".tar"` archive.

## FrameEncoderSettings

In addition to the top level [FrameEncoderSettings](/docs/encoder), these settings are available under the `jpeg` namespace.

* `quality` - See member note. Defaults to 0.8. 

## Members

* `extension` - `".jpeg"`

* `mimeType` - `"image/jpeg"`

* `quality` - See [HTMLCanvasElement.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)

## Source

[modules/core/src/encoders/video/jpeg-sequence-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/video/jpeg-sequence-encoder.js)