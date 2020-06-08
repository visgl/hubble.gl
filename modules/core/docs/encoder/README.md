# Overview

### FrameEncoderSettings

* `startOffsetMs` (`number`, Optional) - Offset the animation. Defaults to 0.

* `durationMs` (`number`, Optional) - Set to render a smaller duration than the whole clip. Defaults to scene length.  
  
* `filename`(`string`, Optional) - Filename for rendered video. Defaults to UUID.

* `framerate` (`number`, Optional) - framerate of rendered video. Defaults to 30.

See encoders for additional namespaced settings.

##### Video

All encoder classes implement the [`Encoder`]() abstract class and inherit from the [`FrameEncoder`]() or [`TarEncoder`]() base classes.

 - WebMEncoder

 - StreamEncoder

 - PNGSequenceEncoder

 - JPEGSequenceEncoder

##### Utility

 - PreviewEncoder
