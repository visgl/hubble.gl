export default class Animation {
  id;
  unattachedKeyframes = [];

  constructor({id}) {
    this.id = id;
    this.unattachedKeyframes = [];
  }

  attachKeyframes(timeline) {
    for (const keyframes of this.unattachedKeyframes) {
      if (keyframes.animationHandle) {
        timeline.detachAnimation(keyframes.animationHandle);
      }
      keyframes.animationHandle = timeline.attachAnimation(keyframes);
    }
    this.unattachedKeyframes = [];
  }

  attachAnimator(animator) {
    this.animator = animator;
  }

  draw() {
    return this.animator(this);
  }
}
