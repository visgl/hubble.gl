export const TOGGLE_ANIMATION_PANEL = 'TOGGLE_ANIMATION_PANEL';

// Clip Actions
export const CREATE_CLIP = 'CREATE_CLIP';
export const EDIT_CLIP = 'EDIT_CLIP';
export const CHANGE_CLIP_LENGTH = 'CHANGE_CLIP_LENGTH';
export const CHANGE_CLIP_ORDER = 'CHANGE_CLIP_ORDER';

// Keyframe Actions
export const EDIT_START_KEYFRAME = 'EDIT_START_KEYFRAME';
export const EDIT_END_KEYFRAME = 'EDIT_END_KEYFRAME';

// Playback Actions
export const PREVIEW_ANIMATION = 'PREVIEW_ANIMATION';
export const PAUSE_ANIMATION = 'PAUSE_ANIMATION';

// Render Actions
export const TOGGLE_RENDER_MODAL = 'TOGGLE_RENDER_MODAL';
export const CHANGE_RENDER_SETTINGS = 'CHANGE_RENDER_SETTINGS';
export const CHANGE_RENDER_STATUS = 'CHANGE_RENDER_STATUS';

export const RENDER_STATUS = {
  IDLE: 'IDLE',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
};

export function toggleAnimationPanel() {
  return {
    type: TOGGLE_ANIMATION_PANEL
  };
}

export function createClip(currentKeyframe, previewImage) {
  return {
    type: CREATE_CLIP,
    currentKeyframe,
    previewImage
  };
}
export function switchToClip(clipIdx) {
  return {
    type: EDIT_CLIP,
    clipIdx
  };
}
export function changeClipLength(clipId, clipLength) {
  return {
    type: CHANGE_CLIP_LENGTH,
    clipId,
    clipLength
  };
}

// export function changeClipOrder

export function editStartKeyframe() {
  return {
    type: EDIT_START_KEYFRAME
  };
}
export function editEndKeyframe() {
  return {
    type: EDIT_END_KEYFRAME
  };
}

export function previewAnimation() {
  return {
    type: PREVIEW_ANIMATION
  };
}

export function pauseAnimation() {
  return {
    type: PAUSE_ANIMATION
  };
}
