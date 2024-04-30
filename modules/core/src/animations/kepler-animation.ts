// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type { Timeline } from '@luma.gl/engine';
import {
  CameraKeyframes,
  KeplerFilterKeyframes,
  KeplerLayerKeyframes,
  KeplerTripKeyframes,
} from '../keyframes/index';
import type {
  CameraDataType,
  CameraKeyframeProps,
  KeplerFilter,
  FilterDataType,
  KeplerFilterKeyframeProps,
  TimeRangeKeyframeAccessor,
  KeplerLayer,
  KeplerLayerKeyframeProps,
  KeplerAnimationConfig,
} from '../keyframes/index';
import Animation, { type AnimationConstructor } from './animation';

function noop() {}

export function findLayer({layers, layerKeyframe}: {layers: KeplerLayer[], layerKeyframe: {id?: string, label?: string}}) {
  // Either find layer using id or label.
  return (
    layers.find(layer => layer.id === layerKeyframe.id) ||
    layers.find(layer => layer.config.label === layerKeyframe.label)
  );
}

export function findFilterIdx({filters, filterKeyframe}: {filters: KeplerFilter[], filterKeyframe: {filterIdx?: number, id?: string}}) {
  // Either find filter using index or id.
  return Number.isFinite(filterKeyframe.filterIdx)
    ? filterKeyframe.filterIdx
    : filters.findIndex(filter => filter.id === filterKeyframe.id);
}

type KeplerAnimationProps = {
  layers?: KeplerLayer[],
  layerKeyframes?: (Omit<KeplerLayerKeyframeProps<object>, 'layer'> & {id?: string, label?: string})[],
  filters?: KeplerFilter[],
  filterKeyframes?: KeplerFilterKeyframeProps[],
  getTimeRangeFilterKeyframes?: TimeRangeKeyframeAccessor,
  animationConfig?: KeplerAnimationConfig,
  tripKeyframe?: KeplerTripKeyframes,
  cameraKeyframe?: CameraKeyframeProps
  timeline?: Timeline
}

type KeplerAnimationConstructor = AnimationConstructor & {
  onTripFrameUpdate?: (currentTime: number) => void
  onFilterFrameUpdate?: (filterIdx: number, key: 'value', value: FilterDataType | number | number[]) => void
  onLayerFrameUpdate?: (layer: KeplerLayer, frame: object) => void,
  onCameraFrameUpdate?: (frame: Partial<CameraDataType>) => void
} & KeplerAnimationProps

export default class KeplerAnimation extends Animation {
  cameraKeyframe: CameraKeyframes;
  layerKeyframes: {[id: string]: KeplerLayerKeyframes<object>} = {};
  filterKeyframes: {[id: string]: KeplerFilterKeyframes} = {};
  tripKeyframe?: KeplerTripKeyframes = undefined;

  onTripFrameUpdate: (currentTime: number) => void;
  onFilterFrameUpdate: (filterIdx: number, key: 'value', value: FilterDataType | number | number[]) => void;
  onLayerFrameUpdate: (layer: KeplerLayer, frame: object) => void;
  onCameraFrameUpdate: (frame: Partial<CameraDataType>) => void;

  constructor({
    id = 'kepler',
    layers = [],
    layerKeyframes = [],
    filters = [],
    filterKeyframes = [],
    getTimeRangeFilterKeyframes = undefined,
    animationConfig = undefined,
    tripKeyframe = undefined,
    cameraKeyframe = undefined,
    onTripFrameUpdate = noop,
    onFilterFrameUpdate = noop,
    onLayerFrameUpdate = noop,
    onCameraFrameUpdate = noop
  }: KeplerAnimationConstructor) {
    super({id});
    this.onTripFrameUpdate = onTripFrameUpdate;
    this.onFilterFrameUpdate = onFilterFrameUpdate;
    this.onLayerFrameUpdate = onLayerFrameUpdate;
    this.onCameraFrameUpdate = onCameraFrameUpdate;
    this.layerKeyframes = {};
    this.filterKeyframes = {};
    this.setKeyframes({
      layers,
      layerKeyframes,
      filters,
      filterKeyframes,
      cameraKeyframe,
      animationConfig,
      tripKeyframe,
      getTimeRangeFilterKeyframes
    });
    this.draw();
  }

  setKeyframes({
    layers = [],
    layerKeyframes = [],
    filters = [],
    filterKeyframes = [],
    getTimeRangeFilterKeyframes = undefined,
    animationConfig = undefined,
    tripKeyframe = undefined,
    cameraKeyframe = undefined,
    timeline = undefined
  }: KeplerAnimationProps) {
    if (this.tripKeyframe && tripKeyframe) {
      this.tripKeyframe.set({animationConfig, ...tripKeyframe});
    } else if (tripKeyframe) {
      this.tripKeyframe = new KeplerTripKeyframes({animationConfig, ...tripKeyframe});
      this.unattachedKeyframes.push(this.tripKeyframe);
    }

    if (this.cameraKeyframe && cameraKeyframe) {
      this.cameraKeyframe.set(cameraKeyframe);
    } else if (cameraKeyframe) {
      this.cameraKeyframe = new CameraKeyframes(cameraKeyframe);
      this.unattachedKeyframes.push(this.cameraKeyframe);
    }

    if (layerKeyframes.length > 0) {
      this.layerKeyframes = layerKeyframes.reduce<{[id: string]: KeplerLayerKeyframes<object>}>((acc, layerKeyframe) => {
        // Either find layer using id or label.
        const layer = findLayer({layers, layerKeyframe});
        if (layer) {
          if (acc[layer.id]) {
            acc[layer.id].set({layer, ...layerKeyframe});
          } else {
            acc[layer.id] = new KeplerLayerKeyframes({layer, ...layerKeyframe});
            this.unattachedKeyframes.push(acc[layer.id]);
          }
        }
        return acc;
      }, this.layerKeyframes);
    }

    if (filterKeyframes.length > 0) {
      this.filterKeyframes = filterKeyframes.reduce((acc, filterKeyframe) => {
        const filterIdx = findFilterIdx({filters, filterKeyframe});
        const filter = filters[filterIdx];
        if (filter) {
          if (acc[filter.id]) {
            acc[filter.id].set({filter, ...filterKeyframe});
          } else {
            acc[filter.id] = new KeplerFilterKeyframes({
              filter,
              filterIdx,
              getTimeRangeFilterKeyframes,
              ...filterKeyframe
            });
            this.unattachedKeyframes.push(acc[filter.id]);
          }
        }
        return acc;
      }, this.filterKeyframes);
    }

    if (timeline) {
      this.attachKeyframes(timeline);
    }
  }

  getKeyframes() {
    return {
      cameraKeyframe: this.cameraKeyframe,
      layerKeyframes: this.layerKeyframes,
      filterKeyframes: this.filterKeyframes,
      tripKeyframe: this.tripKeyframe
    };
  }

  animator(animation: this) {
    if (animation.cameraKeyframe) {
      animation.onCameraFrameUpdate(animation.cameraKeyframe.getFrame());
    }
    if (animation.tripKeyframe) {
      animation.onTripFrameUpdate(animation.tripKeyframe.getFrame().currentTime);
    }
    for (const filterKeyframe of Object.values(animation.filterKeyframes)) {
      animation.onFilterFrameUpdate(filterKeyframe.filterIdx, 'value', filterKeyframe.getFrame());
    }
    for (const layerKeyframe of Object.values(animation.layerKeyframes)) {
      animation.onLayerFrameUpdate(layerKeyframe.layer, layerKeyframe.getFrame());
    }
  }
}
