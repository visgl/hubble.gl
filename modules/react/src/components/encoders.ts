// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import {
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';

export const PREVIEW = 'Preview';
export const WEBM = 'WebM';
export const JPEG = 'JPEG Frames';
export const PNG = 'PNG Frames';
export const GIF = 'GIF';

export const ENCODER_LIST = [PREVIEW, WEBM, JPEG, PNG, GIF];

export const ENCODERS = {
  [PREVIEW]: PreviewEncoder,
  [GIF]: GifEncoder,
  [WEBM]: WebMEncoder,
  [JPEG]: JPEGSequenceEncoder,
  [PNG]: PNGSequenceEncoder
};

export type Encoders = keyof typeof ENCODERS;
