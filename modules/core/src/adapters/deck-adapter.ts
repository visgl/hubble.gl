// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable no-console */
import {type FrameEncoder, PreviewEncoder, type FormatConfigs} from '../encoders/index';
import {AnimationManager} from '../animations/index';
import {type Timecode, VideoCapture} from '../capture/video-capture';
import type {Deck, Layer, DeckProps} from '@deck.gl/core/typed'

export default class DeckAdapter {
  deck: Deck;
  animationManager: AnimationManager;
  shouldAnimate: boolean
  enabled: boolean
  glContext: WebGLRenderingContext
  videoCapture: VideoCapture

  constructor({
    animationManager = undefined, 
    glContext = undefined
  }: {
    animationManager?: AnimationManager, 
    glContext?: WebGLRenderingContext
  }) {
    this.animationManager = animationManager || new AnimationManager({});
    this.glContext = glContext;
    this.videoCapture = new VideoCapture();
    this.shouldAnimate = false;
    this.enabled = false;
    this.getProps = this.getProps.bind(this);
    this.render = this.render.bind(this);
    this.stop = this.stop.bind(this);
    this.seek = this.seek.bind(this);
  }

  setDeck(deck: Deck) {
    this.deck = deck;
  }

  getProps({
    deck, 
    onNextFrame = undefined, 
    extraProps = undefined
  }: {
    deck: Deck
    onNextFrame?: (nextTimeMs: number) => void
    extraProps?: DeckProps
  }) {
    if (deck) {
      this.deck = deck;
    }
    const props: DeckProps = {
      _animate: this.shouldAnimate
    };

    if (onNextFrame) {
      props.onAfterRender = () => this.onAfterRender(onNextFrame);
    }

    if (this.enabled) {
      props.controller = false;
    } else {
      props.controller = true;
    }

    if (this.glContext) {
      props.gl = this.glContext;
    }
    return {...extraProps, ...props};
  }

  render({
    Encoder = PreviewEncoder,
    formatConfigs = {},
    filename = undefined,
    timecode = {start: 0, end: 0, framerate: 30},
    onStopped = undefined,
    onSave = undefined,
    onComplete = undefined
  }: {
    Encoder?: typeof FrameEncoder,
    formatConfigs?: Partial<FormatConfigs>
    filename?: string,
    timecode?: Timecode,
    onStopped?: () => void,
    onSave?: (blob: Blob) => void,
    onComplete?: () => void
  }) {
    this.shouldAnimate = true;
    this.videoCapture.render({
      Encoder,
      formatConfigs,
      timecode,
      filename,
      onStop: () => this.stop({onStopped, onSave, onComplete})
    });
    this.enabled = true;
    this.seek({timeMs: timecode.start});
  }

  stop({
    onStopped, 
    onSave, 
    onComplete, 
    abort
  }: {
    onStopped?: () => void
    onSave?: (blob: Blob) => void
    onComplete?: () => void
    abort?: boolean
  }) {
    this.enabled = false;
    this.shouldAnimate = false;
    this.videoCapture.stop({onStopped, onSave, onComplete, abort});
  }

  seek({timeMs}: {timeMs: number}) {
    this.animationManager.timeline.setTime(timeMs);
    this.animationManager.draw();
  }

  onAfterRender(proceedToNextFrame: (nextTimeMs: number) => void, readyToCapture = true) {
    const areAllLayersLoaded = this.deck && this.deck.props.layers.every(layer => (layer as Layer).isLoaded);
    if (this.videoCapture.isRecording() && areAllLayersLoaded && readyToCapture) {
      // @ts-expect-error TODO use getCanvas
      const canvas = this.deck.canvas
      this.videoCapture.capture(canvas, nextTimeMs => {
        this.seek({timeMs: nextTimeMs});
        proceedToNextFrame(nextTimeMs);
      });
    }
  }
}
