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

export const DEFAULT_ICON_BUTTON_HEIGHT = '16px';
export const DEFAULT_BUTTON_HEIGHT = '32px';
export const DEFAULT_BUTTON_WIDTH = '64px';
export const DEFAULT_PADDING = '32px';
export const DEFAULT_ROW_GAP = '16px';

export const GOOD_16_9 = {
  label: 'Good 16:9 (540p)',
  width: 960,
  height: 540
};
export const HIGH_16_9 = {
  label: 'High 16:9 (720p)',
  width: 1280,
  height: 720
};
export const HIGHEST_16_9 = {
  label: 'Highest 16:9 (1080p)',
  width: 1920,
  height: 1080
};
export const GOOD_4_3 = {
  label: 'Good 4:3 (480p)',
  width: 640,
  height: 480
};
export const HIGH_4_3 = {
  label: 'High 4:3 (960p)',
  width: 1280,
  height: 960
};
export const HIGHEST_4_3 = {
  label: 'Highest 4:3 (1440p)',
  width: 1920,
  height: 1440
};

export function getQualitySettings(label) {
  if (label === 'Good 16:9 (540p)') {
    return GOOD_16_9;
  } else if (label === 'High 16:9 (720p)') {
    return HIGH_16_9;
  } else if (label === 'Highest 16:9 (1080p)') {
    return HIGHEST_16_9;
  } else if (label === 'Good 4:3 (480p)') {
    return GOOD_4_3;
  } else if (label === 'High 4:3 (960p)') {
    return HIGH_4_3;
  } else if (label === 'Highest 4:3 (1440p)') {
    return HIGHEST_4_3;
  }
  throw new Error(`Unsupported Quality Settings label: ${label}`);
}
