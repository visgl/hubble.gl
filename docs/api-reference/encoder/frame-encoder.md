# FrameEncoder

A base class for encoders. Custom frame encoders may be implemented and used by Hubble as new capture technologies advance, or uncommon use cases need to be implemented.

## Usage 

```js
import {FrameEncoder} from '@hubble.gl/core';

// FrameEncoder needs to be extended, and not directly used as an encoder. 
class CustomEncoder extends FrameEncoder {
  constructor(settings) {
    super(settings);
    ...
  }

  start() {
    ...
  }

  async add(canvas) {
    ...
  }

  async save() {
    ...
  }
}

// Then CustomEncoder can be used to render.
const adapter = DeckAdapter({});
adapter.render({Encoder: CustomEncoder, ...});
```


## Constructor

Parameters:

* `settings` (Object)

  * `framerate` (`number`, Optional) - framerate of rendered video. Defaults to 30.

See encoders for additional namespaced settings.

## Members

##### `extension` (String)

File extension.

* Default: `""`

##### `mimeType` (String)

* Default: `""`

MIME type. See [Common MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)

##### `quality` (Number)

* Default: `0.8`

Generic quality value. For canvas capture see [HTMLCanvasElement.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)

##### `framerate` (Number)

* Default: `30`

## Methods

##### start()

Initialize a capture and flush the existing encoder state.

##### add(canvas: HTMLCanvasElement): `Promise<void>`

Add a canvas frame to an in-progress capture.

Parameters:

* `canvas` (`HTMLCanvasElement`) - The canvas to capture.

Returns:

* `Promise<void>` - Add is an async function. The promise will resolve when the frame capture is complete.

##### save(): Promise<Blob | ArrayBuffer>

Compile a video of the captured frames.

Returns:

* `Promise<Blob | ArrayBuffer>` - Save is an async function. The promise will resolve when the video is compiled and will contain a `Blob` or `ArrayBuffer` of the video content. See individual encoders for more details.

## Source

[modules/core/src/encoders/frame-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/frame-encoder.js)