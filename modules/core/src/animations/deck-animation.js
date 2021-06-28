import {CameraKeyframes, DeckLayerKeyframes} from '../keyframes';
import Animation from './animation';

function noop() {}

export default class DeckAnimation extends Animation {
  cameraKeyframe;
  layerKeyframes = {};
  layers = [];

  constructor({
    id = 'deck',
    cameraKeyframe = undefined,
    layers = [],
    getLayers = undefined,
    layerKeyframes = [],
    onLayersUpdate = noop,
    onCameraUpdate = noop
  }) {
    super({id});
    this.layerKeyframes = {};
    this.layers = layers;
    this.onLayersUpdate = onLayersUpdate;
    this.onCameraUpdate = onCameraUpdate;
    this.getLayers = getLayers;
    this.setKeyframes({cameraKeyframe, layerKeyframes});
    this.draw();
  }

  setOnLayersUpdate(onLayersUpdate) {
    this.onLayersUpdate = onLayersUpdate;
  }

  setOnCameraUpdate(onCameraUpdate) {
    this.onCameraUpdate = onCameraUpdate;
  }

  setLayers(layers) {
    this.layers = layers;
    this.draw();
  }

  setGetLayers(getLayers) {
    this.getLayers = getLayers;
    this.draw();
  }

  setKeyframes({layerKeyframes = [], cameraKeyframe = undefined, timeline = undefined}) {
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

  animator(animation) {
    if (animation.cameraKeyframe) {
      animation.onCameraUpdate(animation.cameraKeyframe.getFrame());
    }

    if (Object.values(animation.layerKeyframes).length > 0) {
      if (this.getLayers) {
        animation.onLayersUpdate(this.getLayers(animation));
      } else {
        const layers = animation.layers.map(layer => {
          if (animation.layerKeyframes[layer.id]) {
            const frame = animation.layerKeyframes[layer.id].getFrame();
            return layer.clone({
              ...frame,
              updateTriggers: frame
            });
          }
          return layer;
        });
        animation.onLayersUpdate(layers);
      }
    }
  }
}
