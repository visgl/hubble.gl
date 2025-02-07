# WebmEncoder

A WebM video format encoder that inherits [FrameEncoder](/docs/api-reference/encoder/frame-encoder).

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/docs/api-reference/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

## FrameEncoderSettings

In addition to the top level [FrameEncoder](/docs/api-reference/encoder/frame-encoder) settings, these settings are available under the `webm` namespace.

* `quality` - See member note. Defaults to 0.8.

## Members

* `extension` - `".webm"`

* `mimeType` - `"video/webm"`

## Source

[modules/core/src/encoders/video/webm-encoder.ts](https://github.com/visgl/hubble.gl/tree/1.4-release/modules/core/src/encoders/video/webm-encoder.ts)

### Attributions

WebmEncoder is a wrapper around the [webm-writer](https://github.com/thenickdude/webm-writer-js), which is under WTFPLv2 license, for WebM video construction.