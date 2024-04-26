// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, { KeyframeConstructorProps } from './keyframes';

function getFeatures<T>(keyframes: T[]) {
  return keyframes && keyframes[0] ? Object.keys(keyframes[0]) : [];
}

type DeckLayerKeyframeConstructorProps<T> = KeyframeConstructorProps<T> & {id: string}

export default class DeckLayerKeyframes<T> extends Keyframes<T> {
  id: string;
  constructor({id, features, timings, keyframes, easings}: DeckLayerKeyframeConstructorProps<T>) {
    super({timings, keyframes, easings, features: features || getFeatures(keyframes)});
    this.id = id;
  }
}
