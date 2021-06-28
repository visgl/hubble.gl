/* eslint-disable  max-statements */
import {
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';

import {
  setupRenderer,
  previewVideo,
  renderVideo,
  signalRendering,
  signalPreviewing,
  stopVideo,
  seekTime,
  busySelector,
  timecodeSelector,
  filenameSelector,
  formatConfigsSelector,
  adapterSelector
} from './rendererSlice';

const ENCODERS = {
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

const formatSelector = state => state.hubbleGl.renderer.format;
const encoderSelector = state => ENCODERS[formatSelector(state)] || ENCODERS.webm;

export const rendererMiddleware = store => next => action => {
  switch (action.type) {
    case setupRenderer.type: {
      if (busySelector(store.getState())) {
        const adapter = adapterSelector(store.getState());
        adapter.stop(() => {
          store.dispatch(signalRendering(false)); // equivalent to signalPreviewing(false)
        });
      }
      break;
    }
    case previewVideo.type: {
      const {getCameraKeyframes, getLayerKeyframes, onStop} = action.payload;
      const state = store.getState();
      store.dispatch(signalPreviewing(true));
      const innerOnStop = () => {
        store.dispatch(signalPreviewing(false));
        if (onStop) onStop();
      };
      const adapter = adapterSelector(state);
      adapter.render({
        getCameraKeyframes,
        Encoder: PreviewEncoder,
        formatConfigs: formatConfigsSelector(state),
        timecode: timecodeSelector(state),
        filename: filenameSelector(state),
        onStop: innerOnStop,
        getLayerKeyframes
      });
      break;
    }
    case renderVideo.type: {
      const {getCameraKeyframes, getLayerKeyframes, onStop} = action.payload;
      const state = store.getState();
      const Encoder = encoderSelector(state);

      store.dispatch(signalRendering(true));

      const innerOnStop = () => {
        store.dispatch(signalRendering(false));
        if (onStop) onStop();
      };
      const adapter = adapterSelector(state);
      adapter.render({
        getCameraKeyframes,
        Encoder,
        formatConfigs: formatConfigsSelector(state),
        timecode: timecodeSelector(state),
        filename: filenameSelector(state),
        onStop: innerOnStop,
        getLayerKeyframes
      });

      break;
    }
    case stopVideo.type: {
      const state = store.getState();
      if (busySelector(state)) {
        const adapter = adapterSelector(state);
        adapter.stop(() => {
          store.dispatch(signalRendering(false)); // equivalent to signalPreviewing(false)
        });
      }
      break;
    }
    case seekTime.type: {
      const state = store.getState();
      if (!busySelector(state)) {
        const adapter = adapterSelector(state);
        adapter.seek(action.payload);
      }
      break;
    }
    default: {
      break;
    }
  }

  next(action);
};
