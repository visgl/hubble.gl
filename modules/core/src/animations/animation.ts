// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {Timeline} from '@luma.gl/engine';
import type Keyframes from '../keyframes/keyframes';

type SetKeyframesBase = {
  [id: string]: Keyframes<any> | Timeline;
};

type SetKeyframesProps = SetKeyframesBase & {
  timeline?: Timeline;
};

type GetKeyframes = {
  [id: string]: Keyframes<any> | {[id: string]: Keyframes<any>} | undefined;
};

export type AnimationConstructor = {id?: string};

export default class Animation {
  id: string;
  unattachedKeyframes: Keyframes<any>[] = [];

  constructor({id}: AnimationConstructor) {
    this.id = id;
    this.unattachedKeyframes = [];
  }

  attachKeyframes(timeline: Timeline) {
    for (const keyframes of this.unattachedKeyframes) {
      if (keyframes.animationHandle) {
        timeline.detachAnimation(keyframes.animationHandle);
      }
      keyframes.animationHandle = timeline.attachAnimation(keyframes, undefined);
    }
    this.unattachedKeyframes = [];
  }

  getKeyframes(): GetKeyframes {
    throw new Error('not implemented');
  }

  setKeyframes(props: SetKeyframesProps) {
    throw new Error('not implemented');
  }

  draw() {
    throw new Error('not implemented');
  }
}
