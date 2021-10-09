# AnimationManager

## Usage

```js
const deckAnimation = new DeckAnimation({...})
const keplerAnimation = new KeplerAnimation({...})

const animationManager = new AnimationManager({
  animations: [deckAnimation, keplerAnimation]
});
```

## Constructor

```js
new AnimationManager({timeline, animations});
```

Parameters:

##### `timeline` (`Object`, Optional)

Override the lumagl `timeline` object used in animationManager.

##### `animations` (`Animation[]`, Optional)

An initial set of animations. If they are static, supply them here. If the ever need to update, call `animationManager.setKeyframes`.

## Methods

##### `attachAnimation(animation)`

Attaches an animation's keyframe objects to the timeline.

Parameters:

* **`animation` (`Animation`)**

##### `setKeyframes(animationId, params)`

Updates keyframe values for an attached animation.

Parameters:

* **`animationId` (`string`)**

* **`params` (`object`)** 


##### `draw()`

Draws the current frame for all attached animations.

## Source

[modules/core/src/animations/animation-manager.js](https://github.com/uber/hubble.gl/blob/master/modules/core/src/animations/animation-manager.js)
