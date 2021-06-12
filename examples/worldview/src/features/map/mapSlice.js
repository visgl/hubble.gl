/* eslint-disable no-void */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  ready: false,
  viewState: undefined
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updateViewState: (state, action) =>
      void (state.viewState = {...state.viewState, ...action.payload})
  },
  extraReducers: builder => {
    builder.addCase('@@kepler.gl/REGISTER_ENTRY', state => void (state.ready = true));
  }
});

export const {updateViewState} = mapSlice.actions;

export default mapSlice.reducer;

/**
 * Selectors
 */

export const viewStateSelector = state => state.hubbleGl.map.viewState;
