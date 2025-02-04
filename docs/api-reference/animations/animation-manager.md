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

An initial set of animations. They can also be attached later with `attachAnimation`. Or just update animation keyframes, see `setKeyframes`.

## Methods

##### `attachAnimation(animation)`

Attaches an animation to the timeline and draw cycle.

Parameters:

* **`animation` (`Animation`)**

##### `getAnimation(animationId)`

Return attached animation by id.

##### `setKeyframes(animationId, params)`

Updates keyframe values for an attached animation.

Parameters:

* **`animationId` (`string`)** - same as `animation.id`

* **`params` (`object`)** - same type as provided during animation construction.

##### `getKeyframes(animationId)`

Parameters:

* **`animationId` (`string`)** - same as `animation.id`

Returns:

`Object` - same type as provided during animation construction.

##### `draw()`

Draws the current frame for all attached animations.

## Source

[modules/core/src/animations/animation-manager.ts](https://github.com/visgl/hubble.gl/blob/master/modules/core/src/animations/animation-manager.ts)
