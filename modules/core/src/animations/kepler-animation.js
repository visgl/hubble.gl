import {
  CameraKeyframes,
  KeplerFilterKeyframes,
  KeplerLayerKeyframes,
  KeplerTripKeyframes
} from '../keyframes';
import Animation from './animation';

function noop() {}

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
      tripKeyframe
    });
    this.draw();
  }

  setKeyframes({
    layers = [],
    layerKeyframes = [],
    filters = [],
    filterKeyframes = [],
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
      this.layerKeyframes = layerKeyframes.reduce((acc, value) => {
        // Either find layer using id or label.
        const matchedLayer =
          layers.find(layer => layer.id === value.id) ||
          layers.find(layer => layer.config.label === value.label);
        if (matchedLayer) {
          if (acc[matchedLayer.id]) {
            acc[matchedLayer.id].set({layer: matchedLayer, ...value});
          } else {
            acc[matchedLayer.id] = new KeplerLayerKeyframes({layer: matchedLayer, ...value});
            this.unattachedKeyframes.push(acc[matchedLayer.id]);
          }
        }
        return acc;
      }, this.layerKeyframes);
    }

    if (filterKeyframes.length > 0) {
      this.filterKeyframes = filterKeyframes.reduce((acc, value) => {
        // Either find filter using index or id.
        const filterIdx = value.filterIdx || filters.findIndex(filter => filter.id === value.id);
        const filter = filters[filterIdx];
        if (filter) {
          if (acc[filter.id]) {
            acc[filter.id].set({filter, ...value});
          } else {
            acc[filter.id] = new KeplerFilterKeyframes({filter, filterIdx, ...value});
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
