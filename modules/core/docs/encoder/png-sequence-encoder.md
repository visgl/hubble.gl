# PNGSequenceEncoder

A photo sequence encoder that inherits [FrameEncoder](/modules/core/docs/encoder/frame-encoder). Saves each frame as a photo contained in a `".tar"` archive.

## Constructor

Construction of the encoder class is not required. Refer to [DeckAdapter.render](/modules/core/docs/deck-adapter#render) for usage. The constructor accepts a `FrameEncoderSettings` object.

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

[modules/core/src/encoders/video/png-sequence-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/video/png-sequence-encoder.js)