/* eslint-disable no-void */
import {createAction, createSelector, nanoid, createSlice} from '@reduxjs/toolkit';
import {DeckAdapter} from '@hubble.gl/core';
import {DEFAULT_FILENAME, getResolutionSetting} from './constants';

/** @param payload: onStop */
export const previewVideo = createAction('renderer/previewVideo');

/** @param payload: onStop */
export const renderVideo = createAction('renderer/renderVideo');

/** @param payload: timeMs */
export const seekTime = createAction('renderer/seekTime');

/** @param payload: animation */
export const attachAnimation = createAction('renderer/attachAnimation');

/** @param payload: boolean */
export const signalRendering = createAction('renderer/signalRendering', busy => {
  if (busy) return {payload: 'rendering'};
  return {payload: busy};
});
/** @param payload: boolean */
export const signalPreviewing = createAction('renderer/signalPreviewing', busy => {
  if (busy) return {payload: 'previewing'};
  return {payload: busy};
});

export const stopVideo = createAction('renderer/stopVideo');

function msToSec(ms) {
  return Math.floor(ms / 1000);
}

const defaultResolution = getResolutionSetting();

const initialState = {
  adapter: new DeckAdapter({}),
  busy: false, // 'rendering' | 'previewing'
  resolution: defaultResolution,
  filename: DEFAULT_FILENAME,
  format: 'webm',
  formatConfigs: {
    webm: {
      quality: 0.8
    },
    jpeg: {
      quality: 0.8
    },
    gif: {
      sampleInterval: 1000,
      width: defaultResolution.width,
      height: defaultResolution.height
    },
    png: {}
  },
  timecodeState: {
    framerate: 60,
    start: 0,
    end: -1
  }
};

const filenameChangeSlice = {
  reducer: (state, action) => void (state.filename = action.payload),
  // @param filename: <string? | {filename?, addon: undefined | 'timestamp' | 'uuid'}
  prepare: filename => {
    if (typeof filename === 'string') return {payload: filename};
    const filenameStr = filename.filename || DEFAULT_FILENAME;
    if (filename && filename.addon === 'uuid') return {payload: `${filenameStr}_${nanoid()}`};
    if (filename && filename.addon === 'timestamp')
      return {payload: `${msToSec(Date.now())}_${filenameStr}`};
    return {payload: filenameStr};
  }
};

const resolutionChangeSlice = {
  reducer: (state, action) => void (state.resolution = action.payload),
  // @param resolution: <Preset | {width, height}>
  prepare: resolution => {
    // resolution is preset string
    if (typeof resolution === 'string') return {payload: getResolutionSetting(resolution)};
    return {
      payload: {
        value: 'custom',
        label: 'Custom',
        width: resolution.width,
        height: resolution.height
      }
    };
  }
};

const timecodeChangeSlice = {
  reducer: (state, action) => void (state.timecodeState = action.payload),
  // @param <number | {start, end, framerate?}>
  prepare: timecode => {
    if (typeof timecode === 'number') {
      // timecode is duration
      return {
        payload: {start: 0, end: timecode}
      };
    }
    return {payload: timecode};
  }
};

const rendererSlice = createSlice({
  name: 'renderer',
  initialState,
  reducers: {
    setupRenderer: (state, action /** payload: DeckAdapter */) =>
      void (state.adapter = action.payload),
    filenameChange: filenameChangeSlice,
    formatChange: (state, action /** payload: string */) => void (state.format = action.payload),
    formatConfigsChange: (state, action /** payload: <{[Format]: {}}> */) => {
      state.formatConfigs = {...state.formatConfigs, ...action.payload};
    },
    resolutionChange: resolutionChangeSlice,
    timecodeChange: timecodeChangeSlice
  },
  extraReducers: builder => {
    builder
      .addCase(signalRendering, (state, action) => void (state.busy = action.payload))
      .addCase(signalPreviewing, (state, action) => void (state.busy = action.payload));
  }
});

export const {
  filenameChange,
  formatChange,
  formatConfigsChange,
  resolutionChange,
  timecodeChange,
  setupRenderer
} = rendererSlice.actions;

export default rendererSlice.reducer;

/**
 * Selectors
 */
export const adapterSelector = state => state.hubbleGl.renderer.adapter;

export const framerateSelector = state => state.hubbleGl.renderer.timecodeState.framerate;
export const framestepSelector = createSelector(framerateSelector, framerate => {
  return Math.round(1000 / framerate);
});
export const timecodeSelector = state => state.hubbleGl.renderer.timecodeState;

export const durationSelector = createSelector(timecodeSelector, timecode => {
  return timecode.end - timecode.start;
});

export const formatConfigsSelector = state => state.hubbleGl.renderer.formatConfigs;
export const filenameSelector = state => state.hubbleGl.renderer.filename;

export const resolutionSelector = state => state.hubbleGl.renderer.resolution;

/**
 * Returns a truthy string if busy, otherwise false.
 */

export const busySelector = state => state.hubbleGl.renderer.busy;
