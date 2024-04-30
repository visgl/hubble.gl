// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
export const DEFAULT_ICON_BUTTON_HEIGHT = '16px';
export const DEFAULT_BUTTON_HEIGHT = '32px';
export const DEFAULT_BUTTON_WIDTH = '64px';
export const DEFAULT_PADDING = 32;
export const DEFAULT_ROW_GAP = 24;
export const DEFAULT_SETTINGS_WIDTH = 280;

export const DEFAULT_FILENAME = 'kepler.gl';

export const DEFAULT_PREVIEW_RESOLUTIONS = {'16:9': '1280x720', '4:3': '1280x960'};

export const SIDEPANEL_WIDTH = 300;

export type Format = {
  value: string
  label: string
}

export const FORMATS: Format[] = [
  {
    value: 'gif',
    label: 'GIF'
  },
  {
    value: 'webm',
    label: 'WebM Video'
  },
  {
    value: 'png',
    label: 'PNG Sequence'
  },
  {
    value: 'jpeg',
    label: 'JPEG Sequence'
  }
];

export const ASPECT_RATIOS = {'4_3': '4:3', '16_9': '16:9'};

type Resolution = {
  value: string
  label: string
  width: number
  height: number
  aspectRatio: string
}

export const RESOLUTIONS: Resolution[] = [
  {
    value: '960x540',
    label: 'Good (540p)',
    width: 960,
    height: 540,
    aspectRatio: ASPECT_RATIOS['16_9']
  },
  {
    value: '1280x720',
    label: 'High (720p)',
    width: 1280,
    height: 720,
    aspectRatio: ASPECT_RATIOS['16_9']
  },
  {
    value: '1920x1080',
    label: 'Highest (1080p)',
    width: 1920,
    height: 1080,
    aspectRatio: ASPECT_RATIOS['16_9']
  },
  {
    value: '640x480',
    label: 'Good (480p)',
    width: 640,
    height: 480,
    aspectRatio: ASPECT_RATIOS['4_3']
  },
  {
    value: '1280x960',
    label: 'High (960p)',
    width: 1280,
    height: 960,
    aspectRatio: ASPECT_RATIOS['4_3']
  },
  {
    value: '1920x1440',
    label: 'Highest (1440p)',
    width: 1920,
    height: 1440,
    aspectRatio: ASPECT_RATIOS['4_3']
  }
];

export const isResolution = (value: string) => (option: Resolution) => option.value === value;

export function getResolutionSetting(value: string) {
  return RESOLUTIONS.find(isResolution(value)) || RESOLUTIONS[0];
}
