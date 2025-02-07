# CameraKeyframes

Keyframes to control camera. Inherits from `Keyframes`.

## Usage

```js
const camera = new CameraKeyframes({timings, keyframes, easings, interpolators, width, height});
// Attach each keyframe object to timeline.
timeline.attachAnimation(camera);
```

## Constructor

Parameters:

* `timings` (`Array<number>`) - "N" timestamps for beginning of keyframe.

* `keyframes` (`Array<Object>`) - "N" camera objects to transition between.

  * `longitude` (Number)

  * `latitude` (Number)

  * `zoom` (Number)

  * `pitch` (Number)

  * `bearing` (Number)

* `easings` (`Array<() => void`, Optional) - "N-1" easing functions between keyframes. Default: `t => t` (linear)

* `interpolators` (`Array<'flyTo' | 'linear'>`, Optional) - "N-1" position curve function between keyframes. Default: `'linear'`

## More Info

See hubble.gl Keyframes and [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.

## Source

[modules/core/src/keyframes/camera-keyframes.ts](https://github.com/visgl/hubble.gl/tree/1.4-release/modules/core/src/keyframes/camera-keyframes.ts)