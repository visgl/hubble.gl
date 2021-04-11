export const initialState = {
  clip: {
    settings: {
      mediaType: 'gif', // DONE
      fileName: 'map', // DONE
      resolution: '1280x720', // DONE
      durationMs: 0 // DONE
    },
    timeline: {
      cameraKeyframes: []
    }
  },
  stage: {
    ready: false,
    rendering: false, // busy // DONE
    viewState: {} // DONE
  }
};
