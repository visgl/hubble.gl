# DeckLayerKeyframes

The `DeckLayerKeyframes` class extends the hubble.gl `Keyframes` class and offers support for animating deck.gl layers. The keyframe properties can be any deck.gl layer prop, such as `getRadius`. The `id` property may be provided, and should match the layer id of the deck.gl layer it's linked too.

## Usage

Typically used with [`DeckAnimation`](../animations/deck-animation), the `layerKeyframes` parameter is used to construct `DeckLayerKeyframes`.

```js
new DeckLayerKeyframes({
  id: 'scatterplot-layer',
  keyframes: [
    {lineWidthScale: 1, getRadius: 10, opacity: 0.8},
    {lineWidthScale: 10, getRadius: 5, opacity: 0.8},
    {lineWidthScale: 10, getRadius: 100, opacity: 0},
  ],
  timings: [0, 2000, 4000]
})
```

## Constructor

Parameters:

* `id` (`string`) - deck.gl layer id.

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" prop objects to transition between.

  * Each animated deck.gl prop is a key in this object. The value defines the animation.

* `easings` (`Array<() => void`) - "N-1" easing functions between keyframes.


## More Info

See hubble.gl Keyframes and [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.

## Source

[modules/core/src/keyframes/deck-layer-keyframes.ts](https://github.com/visgl/hubble.gl/blob/master/modules/core/src/keyframes/deck-layer-keyframes.ts)