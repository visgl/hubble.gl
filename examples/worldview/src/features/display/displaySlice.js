/* eslint-disable no-void */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  ready: false,
  viewState: {}
};

const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    updateViewState: (state, action) =>
      void (state.viewState = {...state.viewState, ...action.payload})
  },
  extraReducers: builder => {
    builder.addCase('@@kepler.gl/REGISTER_ENTRY', state => void (state.ready = true));
  }
});

export const {updateViewState} = displaySlice.actions;

export default displaySlice.reducer;

/**
 * Selectors
 */

export const viewStateSelector = state => state.hubbleGl.display.viewState;
