# Keyframes (Class)

The Keyframes class extends the luma.gl [Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) class and adds additional features. In your application, extend from hubble.gl's Keyframes as shown in the `CameraKeyFrames` example. Add `features` to animate, such as `latitude`. When designing your animation, keyframe values are required for each feature you define.

## Usage

```js
import {Keyframes} from '@hubble.gl/core';

// Keyframes is typically extended, and not directly used in animations. 
class CameraKeyFrames extends Keyframes {
  constructor(props) {
    super({
      ...props,
      features: ['latitude', 'longitude', 'zoom', 'pitch', 'bearing']
    });
  }
}

// It can be used directly too.
new Keyframes({features, timings, keyframes, easings = linear, interpolators = 'linear'})
```

## Constructor

Parameters:

* `features` (`Array<string>`) - An array of features to animate.

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" camera objects to transition between.

  * Each `feature` is a key in this object. The value defines the animation.

* `easings` (`Array<() => void`, Optional) - "N-1" easing functions between keyframes. Default: `t => t` (linear)

* `interpolators` (`Array<string>`, Optional) - "N-1" position curve function between keyframes. Default: `'linear'`


## Methods

##### `set({timings, keyframes, easings = linear, interpolators = 'linear'})`

Update keyframe values without re-registering a timeline. Same parameters as keyframe constructor.

##### `get()`

Returns:

`Object` - `{ timings, keyframes, easings, interpolators }`.

##### `getFrame()`

Returns:

`Object` - Each `feature` key will be defined and the value will be the current interpolated value of the frame at the current internal time.

## More Info

See [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.

## Source

[modules/core/src/keyframes/keyframes.ts](https://github.com/visgl/hubble.gl/tree/1.4-release/modules/core/src/keyframes/keyframes.ts)
