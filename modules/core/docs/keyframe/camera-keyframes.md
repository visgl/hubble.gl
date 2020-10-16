# CameraKeyframes

Keyframes to control camera. Inherits from `Keyframes`.

## Usage

```js
const keyframes = {
  camera: new CameraKeyframes({timings, keyframes, easings});
}
// Attach each keyframe object to timeline.
animationLoop.timeline.attachAnimation(keyframes.camera);
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

* `easings` (`Array<() => void`) - "N-1" easing functions between keyframes.

## More Info

See hubble.gl Keyframes and [luma.gl Keyframes](https://luma.gl/docs/api-reference/engine/animation/key-frames) for more information.
