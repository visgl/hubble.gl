# Keyframes

The Keyframes class extends the luma.gl [Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) class and offers many additional features on top of luma's. In your application, extend from hubble.gl's Keyframes as shown in the `CameraKeyFrames` example. Add `features` to animate, such as `latitude`. When designing your scene, keyframe values are required for each feature you define. When constructing anything based on `Keyframes` the `layerId` property may be provided, which should match the layer id of the deck.gl layer you're animating.

## Usage

```js
import {Keyframes} from '@hubble.gl/core';

class CameraKeyFrames extends Keyframes {
  constructor(props) {
    super({
      ...props,
      features: ['latitude', 'longitude', 'zoom', 'pitch', 'bearing']
    });
  }
}
```

## Constructor

Parameters:

* `features` (`Array<string>`) - An array of features to animate.

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" camera objects to transition between.

  * Each `feature` is a key in this object. The value defines the animation.

* `easings` (`Array<() => void`) - "N-1" easing functions between keyframes.

## Methods

##### `getFrame`

Returns:

`Object` - Each `feature` key will be defined and the value will be the current interpolated value of the frame at the current internal time.

## More Info

See [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.
