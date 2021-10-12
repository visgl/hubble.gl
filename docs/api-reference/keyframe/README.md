# Overview

[Keyframe](https://en.wikipedia.org/wiki/Key_frame) animation defines tweens and transitions given a set time-positioned values.
Keyframes interpolated between these values over the course of your animation. Hubble.gl keyframes use luma.gl's keyframe engine. See [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information. `Keyframes` objects should be constructed for each object being animated, such as each deck.gl `Viewport` or `Layer`.

Common `Keyframes` implementations are provided, and you may define new implementations by extending the [`Keyframes`](/docs/api-reference/keyframe/keyframes) class.

##### Provided Keyframe Classes

 - CameraKeyframes - for animating web mercator view state.
 - DeckLayerKeyframes - for animating deck.gl layers, such as ScatterPlotLayer radius.
 - KeplerLayerKeyframes - for animating kepler.gl layers, such as point layer opacity or color.
 - KeplerFilterKeyframes - for animating kepler.gl filters, such as time or range.
 - KeplerTripKeyframes - for animating kepler.gl layer animations, such as trip time.

If using the built-in animation classes, such as [`DeckAnimation`](/docs/api-reference/animations/deck-animation) or [`KeplerAnimation`](/docs/api-reference/animations/kepler-animation), you will not directly construct these keyframes but instead pass in their parameters to animation methods.
