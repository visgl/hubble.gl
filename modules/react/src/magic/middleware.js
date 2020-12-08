import {ActionTypes} from 'kepler.gl/actions';
import {EDIT_START_KEYFRAME} from './actions';

const getClipKeyframeMapState = state => {
  const mapState = state.mapState;
  return {
    latitude: mapState.latitude,
    longitude: mapState.longitude,
    zoom: mapState.zoom,
    pitch: mapState.pitch,
    bearing: mapState.bearing
  };
};

const getClipKeyframeFilters = state => {
  const filters = state.visState.filters;
  return filters.map(filter => ({
    id: filter.id,
    value: filter.value
  }));
};

const getClipKeyframeLayers = state => {
  const layers = state.visState.layers;
  return layers.map(layer => ({
    id: layer.id,
    visConfig: layer.config.visConfig
  }));
};

export const getCurrentKeyframe = state => {
  return {
    mapState: getClipKeyframeMapState(state),
    filters: getClipKeyframeFilters(state),
    layers: getClipKeyframeLayers(state)
  };
};

export const updateClipKeyframeMiddleware = (hubbleGlState, keplerGlState, action) => {
  if (
    action.type === ActionTypes.SET_FILTER ||
    action.type === ActionTypes.UPDATE_MAP ||
    action.type === ActionTypes.LAYER_VIS_CONFIG_CHANGE
  ) {
    // console.log(state, action);
    if (hubbleGlState.editing) {
      const keyframeType = hubbleGlState.editing.keyframe;
      const clipIdx = hubbleGlState.editing.clipIdx;
      const clips = [...hubbleGlState.clips]; // copy
      const clip = {...clips[clipIdx]}; // copy
      let keyframe = keyframeType === EDIT_START_KEYFRAME ? clip.startKeyframe : clip.endKeyframe;

      switch (action.type) {
        case ActionTypes.SET_FILTER: {
          keyframe = {
            ...keyframe,
            filters: getClipKeyframeFilters(keplerGlState.map)
          };
          break;
        }
        case ActionTypes.UPDATE_MAP: {
          keyframe = {
            ...keyframe,
            mapState: getClipKeyframeMapState(keplerGlState.map)
          };
          break;
        }
        case ActionTypes.LAYER_VIS_CONFIG_CHANGE: {
          keyframe = {
            ...keyframe,
            layers: getClipKeyframeLayers(keplerGlState.map)
          };
          break;
        }
        default: {
          return hubbleGlState;
        }
      }
      if (keyframeType === EDIT_START_KEYFRAME) {
        clip.startKeyframe = keyframe;
      } else {
        clip.endKeyframe = keyframe;
      }
      clips[clipIdx] = clip;

      return {
        ...hubbleGlState,
        clips // updated clips
      };
    }
  }

  return hubbleGlState;
};
