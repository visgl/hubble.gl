# AnimationManager

## Usage

```js
// Camera is optional unless animating the deck.gl viewState
const cameraKeyframes = new CameraKeyframes({...})

const animationManager = new AnimationManager({
  cameraKeyframes // optional
});
```

## Constructor

```js
new AnimationManager({timeline, layerKeyframes, cameraKeyframes});
```

Parameters:

##### `timeline` (`Object`, Optional)

Override the lumagl `timeline` object used in animationManager.

##### `animations` (`Animation[]`, Optional)

An initial set of animations. If they are static, supply them here. If the ever need to update, call `animationManager.setKeyframes`.

## Source

[modules/core/src/animations/animation-manager.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/animations/animation-manager.js)
