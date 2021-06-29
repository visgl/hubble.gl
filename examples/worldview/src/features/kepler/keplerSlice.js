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

import keplerGlReducer, {mapStateUpdaters} from 'kepler.gl/reducers';
import {updateViewState} from '../map';

export default keplerGlReducer.plugin({
  [updateViewState]: (state, action) => {
    return {
      ...state,
      mapState: mapStateUpdaters.updateMapUpdater(state.mapState, action)
    };
  }
});

const isKeplerReady = (state, mapId) => {
  if (state.keplerGl[mapId]) return true;
  return false;
};

export const createSelectKeplerLayers = mapId => {
  return state => {
    if (!isKeplerReady(state, mapId)) return undefined;
    return state.keplerGl[mapId].visState.layers;
  };
};

export const createSelectKeplerFilters = mapId => {
  return state => {
    if (!isKeplerReady(state, mapId)) return undefined;
    return state.keplerGl[mapId].visState.filters;
  };
};

export const createSelectKeplerAnimationConfig = mapId => {
  return state => {
    if (!isKeplerReady(state, mapId)) return undefined;
    return state.keplerGl[mapId].visState.animationConfig;
  };
};

export const createSelectKeplerMap = mapId => {
  return state => {
    if (!isKeplerReady(state, mapId)) return undefined;
    return state.keplerGl[mapId];
  };
};

export const createSelectMapStyle = mapId => {
  return state => {
    if (!isKeplerReady(state, mapId)) return undefined;
    const mapStyle = state.keplerGl[mapId].mapStyle;
    return mapStyle.mapStyles[mapStyle.styleType].url;
  };
};
