# Overview

Encoders are used to capture frames of an HTML canvas and construct them into videos. They're constructed and configured internally before each video capture. During capture, they provide asynchronous functions for adding frames and saving videos. See [DeckAdapter.render](/modules/core/docs/deck-adapter#render) for usage.

##### Video

All encoder classes inherit from the [`FrameEncoder`](/modules/core/docs/encoder/frame-encoder) class.

 - WebMEncoder

 - GIFEncoder

 - StreamEncoder

 - PNGSequenceEncoder

 - JPEGSequenceEncoder

##### Utility

 - PreviewEncoder

### Attributions

Encoders started as a fork of [CCapture.js](https://github.com/spite/ccapture.js), which is under MIT license.
