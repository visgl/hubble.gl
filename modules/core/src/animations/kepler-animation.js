// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import {
  CameraKeyframes,
  KeplerFilterKeyframes,
  KeplerLayerKeyframes,
  KeplerTripKeyframes
} from '../keyframes';
import Animation from './animation';

function noop() {}

export function findLayer({layers, layerKeyframe}) {
  // Either find layer using id or label.
  return (
    layers.find(layer => layer.id === layerKeyframe.id) ||
    layers.find(layer => layer.config.label === layerKeyframe.label)
  );
}

export function findFilterIdx({filters, filterKeyframe}) {
  // Either find filter using index or id.
  return Number.isFinite(filterKeyframe.filterIdx)
    ? filterKeyframe.filterIdx
    : filters.findIndex(filter => filter.id === filterKeyframe.id);
}

export default class KeplerAnimation extends Animation {
  cameraKeyframe;
  layerKeyframes = {};
  filterKeyframes = {};
  tripKeyframe = undefined;

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
  }) {
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
  }) {
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
      this.layerKeyframes = layerKeyframes.reduce((acc, layerKeyframe) => {
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

  animator(animation) {
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
