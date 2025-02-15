// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, {KeyframeProps} from './keyframes';

export type DeckLayerKeyframeProps<T> = KeyframeProps<T> & {id: string};

export default class DeckLayerKeyframes<T extends object> extends Keyframes<T> {
  id: string;
  constructor({id, timings, keyframes, easings}: DeckLayerKeyframeProps<T>) {
    super({timings, keyframes, easings});
    this.id = id;
  }
}
