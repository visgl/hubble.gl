// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, { KeyframeProps } from './keyframes';

function getFeatures<T>(keyframes: T[]) {
  return keyframes && keyframes[0] ? Object.keys(keyframes[0]) : [];
}

export type DeckLayerKeyframeProps<T> = KeyframeProps<T> & {id: string}

export default class DeckLayerKeyframes<T extends object> extends Keyframes<T> {
  id: string;
  constructor({id, features, timings, keyframes, easings}: DeckLayerKeyframeProps<T>) {
    super({timings, keyframes, easings, features: features || getFeatures(keyframes)});
    this.id = id;
  }
}
