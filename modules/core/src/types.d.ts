import { Keyframes, CameraKeyframes } from "./keyframes";
import { FrameEncoder } from "./encoders";


type CaptureStepSuccess = {
  kind: 'next-frame'
  nextTimeMs: number
}

type CaptureStepStop = {
  kind: 'stop'
}

type CaptureStepError = {
  kind: 'error'
  error: 'NOT_RECORDING' | string
}

type CaptureStep = CaptureStepSuccess | CaptureStepError | CaptureStepStop

type DeckGl = {
  animationLoop: {
    timeline: {
      setTime: (arg0: number) => void;
    };
  }; canvas: any;
}

type FrameEncoderSettings = Partial<EncoderSettings>

interface EncoderSettings extends FormatConfigs {
  framerate: number
}

interface FormatConfigs {
  png: {
    archive: 'tar' | 'zip'
  }
  jpeg: {
    archive: 'tar' | 'zip'
    quality: number
  },
  webm: {
    quality: number
  }
  gif: {
    numWorkers: number,
    sampleInterval: number,
    width: number,
    height: number
    jpegQuality: number
  }
}
