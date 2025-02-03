# Keyframes Overview

[Keyframe](https://en.wikipedia.org/wiki/Key_frame) animation defines tweens and transitions given a set time-positioned values.
Keyframes interpolated between these values over the course of your animation. Hubble.gl keyframes use luma.gl's keyframe engine. See [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information. `Keyframes` objects should be constructed for each object being animated, such as each deck.gl `Viewport` or `Layer`.

##### Overview of Keyframes

| Keyframe Class        | Description |
| ---                   | ---         |
| [`Keyframes`](/docs/api-reference/keyframe/keyframes) | The base keyframe is typically extended. |
| [`CameraKeyframes`](/docs/api-reference/keyframe/camera-keyframes) | For animating web mercator views. e.g. deck.gl `viewState` or kepler.gl `mapState` |
| [`DeckLayerKeyframes`](/docs/api-reference/keyframe/deck-layer-keyframes) | For animating deck.gl layers, such as ScatterPlotLayer radius. |
| [`KeplerLayerKeyframes`](/docs/api-reference/keyframe/kepler-layer-keyframes) | For animating kepler.gl layers, such as point layer opacity or color. |
| [`KeplerFilterKeyframes`](/docs/api-reference/keyframe/kepler-filter-keyframes) | For animating kepler.gl filters, such as time or range. |
| [`KeplerTripKeyframes`](/docs/api-reference/keyframe/kepler-trip-keyframes) | For animating kepler.gl layer animations, such as trip time. |

If using the built-in animation classes, such as [`DeckAnimation`](/docs/api-reference/animations/deck-animation) or [`KeplerAnimation`](/docs/api-reference/animations/kepler-animation), you will not directly construct these keyframes but instead pass in their parameters to animation methods.
