import {handleActions} from 'redux-actions';
import {
  EDIT_CLIP,
  CREATE_CLIP,
  CHANGE_CLIP_LENGTH,
  EDIT_END_KEYFRAME,
  EDIT_START_KEYFRAME
} from './actions';

/**
 * Generate a hash string based on number of character
 * @param {number} count
 * @returns {string} hash string
 */
export function generateHashId(count) {
  return Math.random()
    .toString(36)
    .substr(count);
}

const editingState = clipIdx => ({
  clipIdx,
  keyframe: EDIT_START_KEYFRAME
});

const createClipState = (currentKeyframe, previewImage) => ({
  id: generateHashId(6),
  length: 10000,
  previewImage,
  startKeyframe: currentKeyframe,
  endKeyframe: currentKeyframe
});

const updateClipLengthState = (clips, changeClipLengthAction) => {
  return clips.map(clip => {
    if (clip.id === changeClipLengthAction.clipId) {
      clip.length = changeClipLengthAction.clipLength;
    }
    return clip;
  });
};

const initalHubbleGlState = {
  playback: {
    currentTime: 0,
    previewing: false
  },
  renderSettings: {
    height: 1080,
    width: 1920,
    framerate: 30,
    encoder: 'webm', // 'png-sequence', 'jpg-sequence', 'ffmpeg'
    quality: 0.8,
    filename: generateHashId(6)
  },
  rendering: false,
  editing: undefined,
  clips: []
};

export const hubbleGlReducer = handleActions(
  {
    [EDIT_CLIP]: (state, action) => ({
      ...state,
      editing: action.clipIdx === -1 ? undefined : editingState(action.clipIdx)
    }),
    [CREATE_CLIP]: (state, action) => ({
      ...state,
      clips: [...state.clips, createClipState(action.currentKeyframe, action.previewImage)],
      editing: editingState(state.clips.length)
    }),
    [CHANGE_CLIP_LENGTH]: (state, action) => ({
      ...state,
      clips: updateClipLengthState(state.clips, action)
    })
  },
  initalHubbleGlState
);

const sampleClip = {
  id: 'abcd',
  length: 10000,
  previewImage: '',
  startKeyframe: {
    mapState: {
      latitude: 32.90824527018466,
      longitude: -96.92693356723468,
      zoom: 9.8,
      pitch: 60,
      bearing: 10
    },
    visState: {
      filters: [{id: '', value: []}],
      layers: [{id: '', visConfig: {}}]
    }
  },
  endKeyframe: {
    mapState: {
      latitude: 32.90824527018466,
      longitude: -96.92693356723468,
      zoom: 9.8,
      pitch: 60,
      bearing: 10
    },
    visState: {
      filters: [{id: '', value: []}],
      layers: [{id: '', visConfig: {}}]
    }
  }
};
