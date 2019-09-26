# FrameEncoder

A base class for encoders that implements the `Encoder` abstract class.

## Constructor

Parameters:

* `quality` (Number, Optional)

* `framerate` (Number, Optional)


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

##### `getMimeType`

Returns:

`string` of mime type.

## Source

[modules/core/src/encoders/frame-encoder.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/encoders/frame-encoder.js)