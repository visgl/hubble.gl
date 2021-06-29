/* eslint-disable no-void */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timeCursor: 0
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    updateTimeCursor: (state, action) => void (state.timeCursor = action.payload)
  }
});

export const {updateTimeCursor} = timelineSlice.actions;

export default timelineSlice.reducer;

/**
 * Selectors
 */

export const timeCursorSelector = state => state.hubbleGl.timeline.timeCursor;
