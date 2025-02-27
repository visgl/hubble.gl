// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import Keyframes, {KeyframeProps} from './keyframes';

export type KeplerLayer = {
  id: string;
  config: {
    label: string;
    visConfig: object;
  };
};

export type KeplerLayerKeyframeProps<T> = KeyframeProps<T> & {layer?: KeplerLayer};

class KeplerLayerKeyframes<T extends object> extends Keyframes<T> {
  layer: KeplerLayer;
  constructor({layer, timings, keyframes, easings}: KeplerLayerKeyframeProps<T>) {
    super({timings, keyframes, easings});
    // TODO: will this layer reference ever become outdated? layerVisConfigChange updates from this reference rather pulling from the store.
    this.layer = layer;
  }

  set({
    layer = undefined,
    timings,
    keyframes,
    easings,
    interpolators
  }: KeplerLayerKeyframeProps<T>) {
    if (layer) this.layer = layer;
    super.set({timings, keyframes, easings, interpolators});
  }
}
export default KeplerLayerKeyframes;
