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

export const FORMATS = [
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

export const RESOLUTIONS = [
  {
    value: 0,
    label: 'Good 16:9 (540p)',
    width: 960,
    height: 540
  },
  {
    value: 1,
    label: 'High 16:9 (720p)',
    width: 1280,
    height: 720
  },
  {
    value: 2,
    label: 'Highest 16:9 (1080p)',
    width: 1920,
    height: 1080
  },
  {
    value: 3,
    label: 'Good 4:3 (480p)',
    width: 640,
    height: 480
  },
  {
    value: 4,
    label: 'High 4:3 (960p)',
    width: 1280,
    height: 960
  },
  {
    value: 5,
    label: 'Highest 4:3 (1440p)',
    width: 1920,
    height: 1440
  }
];

export function getResolutionSetting(index) {
  return RESOLUTIONS[index] || RESOLUTIONS[0];
}
