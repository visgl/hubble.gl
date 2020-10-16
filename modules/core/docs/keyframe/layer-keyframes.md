# LayerKeyframes

The `LayerKeyframes` class extends the hubble.gl `Keyframes` class and offers support for animating deck.gl layers. In your application, extend from `LayerKeyframes` as shown in the `ScatterPlotLayerKeyframes` example. Add `features` to animate, such as `radius`. When designing your scene, keyframe values are required for each feature you define. When constructing anything based on `LayerKeyframes` the `layerId` property may be provided, which should match the layer id of the deck.gl layer you're animating.

## Usage

```js
import {LayerKeyframes} from '@hubble.gl/core';

class ScatterPlotLayerKeyframes extends LayerKeyframes {
  constructor(props) {
    super({...props, features: ['radius', 'opacity']});
  }
}
```

## Constructor

Parameters:

* `layerId` (`string`) - deck.gl layer id.

* `features` (`Array<string>`) - An array of features to animate.

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" camera objects to transition between.

  * Each `feature` is a key in this object. The value defines the animation.

* `easings` (`Array<() => void`) - "N-1" easing functions between keyframes.


## More Info

See hubble.gl Keyframes and [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.
