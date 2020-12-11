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

import React, {Component} from 'react';
import {easing} from 'popmotion';
import {
  DeckAdapter,
  DeckScene,
  CameraKeyframes,
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';

import ExportVideoPanel from './export-video-panel';
import {parseSetCameraType} from './utils';
import {DEFAULT_FILENAME, getResolutionSetting} from './constants';

// import {DEFAULT_TIME_FORMAT} from 'kepler.gl';
// import moment from 'moment';

// function setFileNameDeckAdapter(name) {
//   encoderSettings.filename = `${name} ${moment()
//     .format(DEFAULT_TIME_FORMAT)
//     .toString()}`;
// }

const ENCODERS = {
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

export class ExportVideoPanelContainer extends Component {
  constructor(props) {
    super(props);

    this.setMediaType = this.setMediaType.bind(this);
    this.setCameraPreset = this.setCameraPreset.bind(this);
    this.setFileName = this.setFileName.bind(this);
    this.setResolution = this.setResolution.bind(this);
    this.setViewState = this.setViewState.bind(this);
    this.getCameraKeyframes = this.getCameraKeyframes.bind(this);
    this.getDeckScene = this.getDeckScene.bind(this);
    this.onPreviewVideo = this.onPreviewVideo.bind(this);
    this.onRenderVideo = this.onRenderVideo.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.setViewState = this.setViewState.bind(this);

    const {
      initialState,
      mapData: {mapState},
      glContext
    } = props;

    this.state = {
      mediaType: 'gif',
      cameraPreset: 'Orbit (90º)',
      fileName: '',
      resolution: '1280x720',
      durationMs: 1000, // TODO change to 5000 later. 1000 for dev testing
      viewState: mapState,
      adapter: new DeckAdapter(this.getDeckScene, glContext),
      ...(initialState || {})
    };
  }

  getFileName() {
    const {fileName} = this.state;
    if (fileName === '') return DEFAULT_FILENAME;
    return fileName;
  }

  getCanvasSize() {
    const {resolution} = this.state;
    return getResolutionSetting(resolution);
  }

  getEncoderSettings() {
    const fileName = this.getFileName();
    const {width, height} = this.getCanvasSize();

    return {
      framerate: 30,
      webm: {
        quality: 0.8
      },
      jpeg: {
        quality: 0.8
      },
      gif: {
        sampleInterval: 1000,
        width,
        height
      },
      filename: fileName
    };
  }

  getEncoder() {
    const {mediaType} = this.state;
    return ENCODERS[mediaType];
  }

  getCameraKeyframes(prevCamera = undefined) {
    const {viewState, cameraPreset, durationMs} = this.state;
    const {longitude, latitude, zoom, pitch, bearing} = viewState;

    return new CameraKeyframes({
      timings: [0, durationMs],
      keyframes: [
        {
          longitude,
          latitude,
          zoom,
          pitch,
          bearing
        },
        parseSetCameraType(cameraPreset, viewState)
      ],
      easings: [easing.easeInOut]
    });
  }

  getDeckScene(animationLoop) {
    // PSEUDO BRAINSTORM
    // only runs once and permanently sets things like canvas resolution + duration
    const {durationMs} = this.state;
    const {width, height} = this.getCanvasSize();

    const keyframes = {
      camera: this.getCameraKeyframes()
    };
    const currentCamera = animationLoop.timeline.attachAnimation(keyframes.camera);

    // TODO this scales canvas resolution but is only set once. Figure out how to update
    // TODO this needs to update durationMs
    return new DeckScene({
      animationLoop,
      keyframes,
      lengthMs: durationMs,
      width,
      height,
      currentCamera
    });
  }

  setStateAndNotify(update) {
    const {
      props: {onSettingsChange},
      state
    } = this;
    this.setState({...state, ...update});

    if (onSettingsChange) {
      const {mediaType, cameraPreset, fileName, resolution, durationMs} = state;
      onSettingsChange({
        mediaType,
        cameraPreset,
        fileName,
        resolution,
        durationMs,
        ...update
      });
    }
  }

  setMediaType(mediaType) {
    this.setStateAndNotify({mediaType});
  }

  setCameraPreset(cameraPreset) {
    this.setStateAndNotify({cameraPreset});
  }

  setFileName(fileName) {
    this.setStateAndNotify({fileName});
  }

  setResolution(resolution) {
    this.setStateAndNotify({resolution});
  }

  setViewState(vs) {
    this.setState({viewState: vs.viewState});
  }

  onPreviewVideo() {
    const {adapter} = this.state;
    const encoderSettings = this.getEncoderSettings();
    const onStop = () => {
      this.forceUpdate();
    };
    adapter.render(PreviewEncoder, encoderSettings, onStop, this.getCameraKeyframes);
  }

  onRenderVideo() {
    const {adapter} = this.state;
    const Encoder = this.getEncoder();
    const encoderSettings = this.getEncoderSettings();
    const onStop = () => {};

    adapter.render(Encoder, encoderSettings, onStop, this.getCameraKeyframes);
  }

  setDuration(durationMs) {
    const {adapter} = this.state;
    adapter.scene.lengthMs = durationMs;
    // function passed down to Slider class in ExportVideoPanelSettings
    this.setStateAndNotify({durationMs});
  }

  render() {
    const {exportVideoWidth, handleClose, mapData, header} = this.props;
    const {
      adapter,
      durationMs,
      mediaType,
      cameraPreset,
      fileName,
      resolution,
      viewState
    } = this.state;

    const settingsData = {mediaType, cameraPreset, fileName, resolution};

    const encoderSettings = this.getEncoderSettings();
    const {width, height} = this.getCanvasSize();

    return (
      <ExportVideoPanel
        // UI Props
        exportVideoWidth={exportVideoWidth}
        handleClose={handleClose}
        header={header}
        // Map Props
        mapData={mapData}
        viewState={viewState}
        setViewState={this.setViewState}
        // Settings Props
        settingsData={settingsData}
        setMediaType={this.setMediaType}
        setCameraPreset={this.setCameraPreset}
        setFileName={this.setFileName}
        setResolution={this.setResolution}
        // Hubble Props
        adapter={adapter}
        handlePreviewVideo={this.onPreviewVideo}
        handleRenderVideo={this.onRenderVideo}
        durationMs={durationMs}
        setDuration={this.setDuration}
        frameRate={encoderSettings.framerate}
        resolution={[width, height]}
        mediaType={mediaType}
      />
    );
  }
}

ExportVideoPanelContainer.defaultProps = {
  exportVideoWidth: 540,
  header: true,
  glContext: undefined
};
