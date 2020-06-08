# WebmEncoder

A WebM video format encoder that inherits [FrameEncoder]().

## FrameEncoderSettings

In addition to the top level [FrameEncoderSettings](/docs/encoder), these settings are available under the `webm` namespace.

* `quality` - See member note. Defaults to 0.8. 

## Members

* `extension` - `".webm"`

* `mimeType` - `"video/webm"`

## Source

[modules/core/src/encoders/video/webm-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/video/webm-encoder.js)