// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {FrameEncoderSettings} from '../frame-encoder';
import PhotoEncoder from './photo-encoder';

class JPEGEncoder extends PhotoEncoder {
  constructor(settings: FrameEncoderSettings) {
    super(settings);
    this.mimeType = 'image/jpeg';
    this.extension = '.jpg';
  }
}

export default JPEGEncoder;
