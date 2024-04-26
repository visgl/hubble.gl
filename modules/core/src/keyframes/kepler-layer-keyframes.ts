// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, { KeyframeConstructorProps, KeyframeProps } from './keyframes';

function getFeatures(layer: {config: {visConfig: Object}}) {
  return Object.keys(layer.config.visConfig);
}

export type KeplerLayerKeyframeConstructorProps<T> = KeyframeConstructorProps<T> & {layer: any}

class KeplerLayerKeyframes<T> extends Keyframes<T> {
  layer: any;
  constructor({layer, timings, keyframes, easings}: KeplerLayerKeyframeConstructorProps<T>) {
    super({timings, keyframes, easings, features: getFeatures(layer)});
    // TODO: will this layer reference ever become outdated? layerVisConfigChange updates from this reference rather pulling from the store.
    this.layer = layer;
  }

  set({layer = undefined, timings, keyframes, easings, interpolators}: KeyframeProps<T> & { layer?: any }) {
    if (layer) this.layer = layer;
    super.set({timings, keyframes, easings, interpolators});
  }
}
export default KeplerLayerKeyframes;
