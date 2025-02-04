# PNGSequenceEncoder

A photo sequence encoder that inherits [FrameEncoder](/docs/api-reference/encoder/frame-encoder). Saves each frame as a photo contained in a `".tar"` archive.

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/docs/api-reference/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

## FrameEncoderSettings

In addition to the [FrameEncoder](/docs/api-reference/encoder/frame-encoder) settings, these settings are available under the `png` namespace.

* `archive` - `zip` or `tar`. Defaults to `tar`.

**Notes:**

PNG supports alpha channel and will produce the highest quality encoding.

Convert PNGs to a video with ffmpeg or a proprietary encoder, like Adobe Media Encoder.

```bash
ffmpeg -pattern_type glob -framerate 30 -pix_fmt yuv420p -i "*.png" -tune animation -crf 1 -preset slow video.mp4
```

## Members

* `extension` - `".png"`

* `mimeType` - `"image/png"`

## Source

[modules/core/src/encoders/video/png-sequence-encoder.ts](https://github.com/visgl/hubble.gl/blob/master/modules/core/src/encoders/video/png-sequence-encoder.ts)