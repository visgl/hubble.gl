// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {Timeline} from '@luma.gl/engine';
import {
  CameraDataType,
  CameraKeyframeProps,
  CameraKeyframes,
  DeckLayerKeyframes,
  DeckLayerKeyframeProps
} from '../keyframes/index';
import Animation, {AnimationConstructor} from './animation';
import type {Layer} from '@deck.gl/core/typed';

function noop() {}

export type DeckAnimationProps = {
  layerKeyframes?: DeckLayerKeyframeProps<object>[];
  cameraKeyframe?: CameraKeyframeProps;
  timeline?: Timeline;
};

export type DeckAnimationConstructor = AnimationConstructor & {
  getLayers: (animation: DeckAnimation) => Layer[];
  onLayersUpdate: (layers: Layer[]) => void;
  onCameraUpdate?: (frame: CameraDataType) => void;
} & DeckAnimationProps;

export default class DeckAnimation extends Animation {
  cameraKeyframe?: CameraKeyframes;
  layerKeyframes: {[layerId: string]: DeckLayerKeyframes<object>} = {};

  getLayers: (animation: DeckAnimation) => Layer[];
  onLayersUpdate: (layers: Layer[]) => void;
  onCameraUpdate: (frame: CameraDataType) => void;

  constructor({
    id = 'deck',
    cameraKeyframe = undefined,
    getLayers = _ => [],
    layerKeyframes = [],
    onLayersUpdate = noop,
    onCameraUpdate = noop
  }: DeckAnimationConstructor) {
    super({id});
    this.layerKeyframes = {};
    this.onLayersUpdate = onLayersUpdate;
    this.onCameraUpdate = onCameraUpdate;
    this.getLayers = getLayers;
    this.setKeyframes({cameraKeyframe, layerKeyframes});
    this.draw();
  }

  setOnLayersUpdate(onLayersUpdate: (layers: Layer[]) => void) {
    this.onLayersUpdate = onLayersUpdate;
  }

  setOnCameraUpdate(onCameraUpdate: (frame: CameraDataType) => void) {
    this.onCameraUpdate = onCameraUpdate;
  }

  setGetLayers(getLayers: (animation: DeckAnimation) => Layer[]) {
    this.getLayers = getLayers;
    this.draw();
  }

  setKeyframes({
    layerKeyframes = [],
    cameraKeyframe = undefined,
    timeline = undefined
  }: DeckAnimationProps) {
    if (this.cameraKeyframe && cameraKeyframe) {
      this.cameraKeyframe.set(cameraKeyframe);
    } else if (cameraKeyframe) {
      this.cameraKeyframe = new CameraKeyframes(cameraKeyframe);
      this.unattachedKeyframes.push(this.cameraKeyframe);
    }

    if (layerKeyframes && layerKeyframes.length > 0) {
      this.layerKeyframes = layerKeyframes.reduce((acc, value) => {
        if (acc[value.id]) {
          acc[value.id].set(value);
        } else {
          acc[value.id] = new DeckLayerKeyframes(value);
          this.unattachedKeyframes.push(acc[value.id]);
        }
        return acc;
      }, this.layerKeyframes);
    }

    if (timeline) {
      this.attachKeyframes(timeline);
    }
  }

  getKeyframes() {
    return {
      cameraKeyframe: this.cameraKeyframe,
      layerKeyframes: this.layerKeyframes
    };
  }

  animator(animation: DeckAnimation) {
    if (animation.cameraKeyframe) {
      animation.onCameraUpdate(animation.cameraKeyframe.getFrame());
    }

    if (Object.values(animation.layerKeyframes).length > 0) {
      animation.onLayersUpdate(this.getLayers(animation));
    }
  }

  applyLayerKeyframes(layers: Layer[]) {
    return layers.map(layer => {
      if (this.layerKeyframes[layer.id]) {
        const frame = this.layerKeyframes[layer.id].getFrame();
        return layer.clone({
          ...frame,
          updateTriggers: frame
        });
      }
      return layer;
    });
  }
}
