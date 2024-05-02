// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Intialize globals, check version
export {VERSION} from './lib/init';

export {DeckAdapter} from './adapters/index';

export {
  PNGSequenceEncoder,
  JPEGSequenceEncoder,
  JPEGEncoder,
  PNGEncoder,
  WebMEncoder,
  FrameEncoder,
  PreviewEncoder,
  GifEncoder
} from './encoders/index';

export {
  Keyframes,
  CameraKeyframes,
  hold,
  linear,
  DeckLayerKeyframes,
  KeplerFilterKeyframes,
  KeplerLayerKeyframes,
  KeplerTripKeyframes
} from './keyframes/index';

export {AnimationManager, Animation, DeckAnimation, KeplerAnimation} from './animations/index';

// Types
export type {FormatConfigs, FrameEncoderSettings} from './encoders/index';
export type {
  AnimationConstructor,
  DeckAnimationConstructor,
  DeckAnimationProps
} from './animations/index';
export type {
  KeyframeProps,
  CameraDataType,
  CameraKeyframeProps,
  DeckLayerKeyframeProps,
  KeplerLayerKeyframeProps,
  KeplerLayer,
  KeplerFilterKeyframeProps,
  FilterDataType,
  KeplerFilter,
  TimeRangeKeyframeAccessor,
  KeplerTripKeyframeProps,
  TripDataType,
  KeplerAnimationConfig
} from './keyframes/index';
export type {Timecode} from './capture/video-capture';
