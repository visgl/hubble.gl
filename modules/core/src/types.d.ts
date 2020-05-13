import { FrameEncoder } from "./encoders";
import { DeckScene } from "./scene";

type CaptureStepSuccess = {
  kind: 'step'
  nextTimeMs: number
}

type CaptureStepError = {
  kind: 'error'
  error: 'NOT_RECORDING' | 'STOP' | string
}

type CaptureStep = CaptureStepSuccess | CaptureStepError

type DeckGl = {
  animationLoop: {
    timeline: {
      setTime: (arg0: number) => void;
    };
  }; canvas: any;
}

interface FrameEncoderSettings {
  quality?: number
  framerate?: number
}

interface HubbleGlSettings {
  deck: any // instance of deckgl
  recordingLengthMs: number
  encoder: FrameEncoder
}

interface DeckSceneParams {
  animationLoop: any
  length: number
  keyframes: any
  data: any
  renderLayers: (scene: DeckScene) => any[]
}


// declare module 'src/hubble.gl' {
//   interface IFrameEncoder extends Encoder {
//     extension: string;
//     filename: string;
//     mimeType: string;
//     settings: Settings;
//     constructor(settings: Settings);
//     getMimeType: () => string;
//   }

//   export interface FrameEncoder implements IFrameEncoder {}
// }

// interface Encoder {
//   start: () => void;
//   stop: () => void;
//   add: (canvas: HTMLCanvasElement) => Promise<void>;
//   save: () => Promise<Blob>;
//   dispose: () => void;
// }

// export module 'hubble.gl/src/encoders/FrameEncoder' {
//   interface IFrameEncoder extends Encoder {
//     extension: string;
//     filename: string;
//     mimeType: string;
//     settings: Settings;
//     constructor(settings: Settings);
//     getMimeType: () => string;
//   }

//   interface FrameEncoder implements IFrameEncoder {}

//   // declare var FrameEncoder: {
//   //   prototype: FrameEncoder;
//   //   new(): FrameEncoder;
//   // }
// }

// /**
//  * @typedef {Object} Settings
//  * @property {string} name
//  * @property {number} workers
//  * @property {number} quality
//  * @property {string} workersPath
//  * @property {number} step
//  * @property {number} framerate
//  * @property {(progress: number) => void} onProgress
//  */
