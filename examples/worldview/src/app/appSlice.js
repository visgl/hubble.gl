// Copyright (c) 2020 Uber Technologies, Inc.
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

import {handleActions} from 'redux-actions';

export const SET_SAMPLE_LOADING_STATUS = 'SET_SAMPLE_LOADING_STATUS';

export function setLoadingMapStatus(isMapLoading) {
  return {
    type: SET_SAMPLE_LOADING_STATUS,
    isMapLoading
  };
}

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example',
  loaded: false,
  isMapLoading: false, // determine whether we are loading a sample map,
  error: null // contains error when loading/retrieving data/configuration
  // {
  //   status: null,
  //   message: null
  // }
  // eventually we may have an async process to fetch these from a remote location
};

// App reducer
const appReducer = handleActions(
  {
    [SET_SAMPLE_LOADING_STATUS]: (state, action) => ({
      ...state,
      isMapLoading: action.isMapLoading
    })
  },
  initialAppState
);

export default appReducer;
