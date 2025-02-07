# DeckLayerKeyframes

The `DeckLayerKeyframes` class extends the hubble.gl `Keyframes` class and offers support for animating deck.gl layers. The animated `features` can be any deck.gl layer prop, such as `getRadius`. The `id` property may be provided, and should match the layer id of the deck.gl layer it's linked too.

## Usage

See `DeckAnimation`, the `layerKeyframes` parameter is passed to `DeckLayerKeyframes`.

## Constructor

Parameters:

* `id` (`string`) - deck.gl layer id.

* `features` (`Array<string>`, Optional) - An array of features to animate. If not provided explicitly, the first keyframe must have all animated features.

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" camera objects to transition between.

  * Each `feature` is a key in this object. The value defines the animation.

* `easings` (`Array<() => void`) - "N-1" easing functions between keyframes.


## More Info

See hubble.gl Keyframes and [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.

## Source

[modules/core/src/keyframes/deck-layer-keyframes.ts](https://github.com/visgl/hubble.gl/tree/1.4-release/modules/core/src/keyframes/deck-layer-keyframes.ts)