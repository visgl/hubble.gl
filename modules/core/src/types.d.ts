import { Keyframes, MapViewKeyframes } from "./keyframes";
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

interface EncoderSettings {
  framerate: number
}

interface GIFSettings extends EncoderSettings {
  numWorkers: number
  sampleInterval: number
  width: number
  height: number
  jpegQuality: number
}

interface WEBMSettings extends EncoderSettings {
  quality: number
}

interface PNGSettings extends EncoderSettings {
  archive: 'tar' | 'zip'
}

interface JPEGSettings extends EncoderSettings {
  archive: 'tar' | 'zip'
  quality: number
}

interface RealtimeSettings extends EncoderSettings {
  video: 'webm' | 'mp4'
}