# Encoders

Encoders are used to capture image frames of an HTML `<canvas/>` and encode them into videos. Each instance of an encoder represents a file artifact. During capture, they provide asynchronous functions for adding frames and saving videos. See [DeckAdapter.render](/docs/api-reference/deck-adapter#renderen) for usage.

##### Overview of Encoders



| Encoder Class         | Type              | Description |
| ---                   | ---               | ---         |
| [`FrameEncoder`](/docs/api-reference/encoder/frame-encoder) | Base     | The base encoder needs to be implemented with a `start`, `add`, and `save` function. |
| [`PreviewEncoder`](/docs/api-reference/encoder/preview-encoder) | Utility     | A mock encoder used to preview animations. |
| [`WebMEncoder`](/docs/api-reference/encoder/webm-encoder) | Video     | Encodes `.webm` video using [Whammy](https://antimatter15.com/2012/08/whammy-a-real-time-javascript-webm-encoder/). |
| [`GIFEncoder`](/docs/api-reference/encoder/gif-encoder) | Animated Image | Encodes `.gif` images using `gifshot.js`. | 
| [`StreamEncoder`](/docs/api-reference/encoder/stream-encoder) | Video     | Encodes `.webm` rough previews, but drops frames. |
| [`PNGSequenceEncoder`](/docs/api-reference/encoder/png-sequence-encoder) | Image Sequence | Encodes video frames as loseless `.png` contained in a `.tar`. |
| [`JPEGSequenceEncoder`](/docs/api-reference/encoder/jpeg-sequence-encoder) | Image Sequence | Encodes video frames as compressed `.jpeg` contained in a `.tar`. |

### Attributions

Encoders started as a fork of [CCapture.js](https://github.com/spite/ccapture.js), which is under MIT license.
