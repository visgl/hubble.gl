/* eslint-disable no-void */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cameraKeyframes: undefined, // keyframe object
  filterKeyframes: undefined, // keyframe object
  layerKeyframes: {} // name: keyframe object
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    updateCameraKeyframes: (state, action) => void (state.cameraKeyframes = action.payload),
    updateFilterKeyframes: (state, action) => void (state.filterKeyframes = action.payload),
    updateLayerKeyframes: (state, action) =>
      void (state.layerKeyframes = {...state.layerKeyframes, ...action.payload})
  }
});

export const {
  updateCameraKeyframes,
  updateFilterKeyframes,
  updateLayerKeyframes
} = timelineSlice.actions;

export default timelineSlice.reducer;

/**
 * Selectors
 */

export const cameraKeyframeSelector = state => state.hubbleGl.timeline.cameraKeyframes;
export const filterKeyframeSelector = state => state.hubbleGl.timeline.filterKeyframes;
export const layerKeyframeSelector = state => state.hubbleGl.timeline.layerKeyframes;
