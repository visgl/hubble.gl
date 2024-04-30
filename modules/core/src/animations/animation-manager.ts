// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {Timeline} from '@luma.gl/engine';
import type Animation from './animation'
import type { Keyframes } from '../keyframes';

export default class AnimationManager {
  timeline: Timeline;
  animations: {[id: string]: Animation} = {};

  constructor({timeline = undefined, animations = []}: {timeline?: Timeline, animations: Animation[]}) {
    this.timeline = timeline || new Timeline();
    for (const animation of animations) {
      this.attachAnimation(animation);
    }
  }

  attachAnimation(animation: Animation) {
    animation.attachKeyframes(this.timeline);
    this.animations[animation.id] = animation;
  }

  setKeyframes(animationId: string, params: {[id: string]: Keyframes<object>}) {
    this.animations[animationId].setKeyframes({
      timeline: this.timeline,
      ...params
    });
  }

  getKeyframes(animationId: string) {
    return this.animations[animationId].getKeyframes();
  }

  getAnimation(animationId: string) {
    return this.animations[animationId];
  }

  draw() {
    Object.values(this.animations).forEach(animation => animation.draw());
  }
}
