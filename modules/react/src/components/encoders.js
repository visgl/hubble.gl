import {
  WEBMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GIFEncoder
} from '@hubble.gl/core';

export const PREVIEW = 'Preview';
export const WEBM = 'WebM';
export const JPEG = 'JPEG Frames';
export const PNG = 'PNG Frames';
export const GIF = 'GIF';

export const ENCODER_LIST = [PREVIEW, WEBM, JPEG, PNG, GIF];

export const ENCODERS = {
  [PREVIEW]: PreviewEncoder,
  [GIF]: GIFEncoder,
  [WEBM]: WEBMEncoder,
  [JPEG]: JPEGSequenceEncoder,
  [PNG]: PNGSequenceEncoder
};
