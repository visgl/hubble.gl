# Overview

Keyframes are responsible for interpolating between values over the course of your animation. Hubble.gl keyframes use luma.gl's keyframe engine. See [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information. `Keyframes` objects should be constructed for each object being animated, such as each deck.gl `Viewport` or `Layer`.

It's very straightforward to define new kinds of `Keyframe` classes, so hubble.gl only provides a few very popular examples.

##### Keyframes

All keyframe classes inherit from the hubble.gl [`Keyframes`](/modules/core/docs/keyframe/keyframes) base class.

 - CameraKeyframes

##### LayersKeyframes

All layer keyframe classes inherit from the [`LayerKeyframes`](/modules/core/docs/keyframe/layer-keyframes) base class. Each instance is associated with a deck.gl `layerId`.

 - ScatterPlotLayerKeyframes

 - GridLayerKeyframes