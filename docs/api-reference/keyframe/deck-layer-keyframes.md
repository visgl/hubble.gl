# DeckLayerKeyframes

The `DeckLayerKeyframes` class extends the hubble.gl `Keyframes` class and offers support for animating deck.gl layers.

## Usage

See `DeckAnimation`, the `layerKeyframes` parameter is passed to `DeckLayerKeyframes`.

## Constructor

Parameters:

* `id` (`string`) - deck.gl layer id.

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" camera objects to transition between.

  * Each `feature` is a key in this object. The value defines the animation.

* `easings` (`Array<() => void`) - "N-1" easing functions between keyframes.


## More Info

See hubble.gl Keyframes and [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.

## Source

[modules/core/src/keyframes/deck-layer-keyframes.ts](https://github.com/visgl/hubble.gl/blob/master/modules/core/src/keyframes/deck-layer-keyframes.ts)