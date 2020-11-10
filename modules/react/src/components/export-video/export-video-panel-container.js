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
import {parseSetCameraType} from './parse-set-camera-type';

// import {DEFAULT_TIME_FORMAT} from 'kepler.gl';
// import moment from 'moment';

// function setFileNameDeckAdapter(name) {
//   encoderSettings.filename = `${name} ${moment()
//     .format(DEFAULT_TIME_FORMAT)
//     .toString()}`;
// }

export class ExportVideoPanelContainer extends Component {
  static defaultProps = {
    exportVideoWidth: 980
  };

  constructor(props) {
    super(props);

    this.setMediaTypeState = this.setMediaTypeState.bind(this);
    this.setCameraPreset = this.setCameraPreset.bind(this);
    this.setFileName = this.setFileName.bind(this);
    this.setQuality = this.setQuality.bind(this);
    this.getCameraKeyframes = this.getCameraKeyframes.bind(this);
    this.getDeckScene = this.getDeckScene.bind(this);
    this.onPreviewVideo = this.onPreviewVideo.bind(this);
    this.onRenderVideo = this.onRenderVideo.bind(this);

    this.state = {
      mediaType: 'GIF',
      cameraPreset: 'None',
      fileName: 'Video Name',
      quality: 'High (720p)',
      viewState: this.props.mapData.mapState,
      durationMs: 1000,
      encoderSettings: {
        framerate: 30,
        webm: {
          quality: 0.8
        },
        jpeg: {
          quality: 0.8
        },
        gif: {
          sampleInterval: 1000,
          width: 1280,
          height: 720
        },
        filename: 'kepler.gl'
      },
      adapter: new DeckAdapter(this.getDeckScene)
    };
  }

  getCameraKeyframes(prevCamera = undefined) {
    const {viewState, cameraPreset, durationMs} = this.state;

    return new CameraKeyframes({
      timings: [0, durationMs],
      keyframes: [
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing
        },
        parseSetCameraType(cameraPreset, viewState)
      ],
      easings: [easing.easeInOut]
    });
  }

  getDeckScene(animationLoop) {
    const keyframes = {
      camera: this.getCameraKeyframes()
    };
    const currentCamera = animationLoop.timeline.attachAnimation(keyframes.camera);

    return new DeckScene({
      animationLoop,
      keyframes,
      lengthMs: this.state.durationMs, // TODO change to 5000 later. 1000 for dev testing
      width: 480,
      height: 460,
      currentCamera
    });
  }

  setMediaTypeState(media) {
    this.setState({
      mediaType: media
    });
  }
  setCameraPreset(option) {
    this.setState({
      cameraPreset: option
    });
  }
  setFileName(name) {
    this.setState({
      fileName: name.target.value
    });
    // setFileNameDeckAdapter(name.target.value);
  }
  setQuality(resolution) {
    // NOTE: resolution is string user selects ex: 'Good (540p)'\
    const {encoderSettings} = this.state;

    let newWidth = encoderSettings.gif.width;
    let newHeight = encoderSettings.gif.height;

    if (resolution === 'Good (540p)') {
      newWidth = 960;
      newHeight = 540;
    } else if (resolution === 'High (720p)') {
      newWidth = 1280;
      newHeight = 720;
    } else if (resolution === 'Highest (1080p)') {
      newWidth = 1920;
      newHeight = 1080;
    }

    this.setState({
      quality: resolution,
      encoderSettings: {
        ...encoderSettings,
        gif: {
          ...encoderSettings.gif,
          width: newWidth,
          height: newHeight
        }
        // TODO Add other encoders as needed. Not yet implemented
      }
    });
  }

  onPreviewVideo() {
    const {adapter, encoderSettings} = this.state;

    const onStop = () => {};
    adapter.render(PreviewEncoder, encoderSettings, onStop, this.getCameraKeyframes);
  }

  onRenderVideo() {
    const {adapter, encoderSettings, mediaType} = this.state;
    let Encoder = PreviewEncoder;
    const onStop = () => {};

    if (mediaType === 'WebM Video') {
      Encoder = WebMEncoder;
    } else if (mediaType === 'PNG Sequence') {
      Encoder = PNGSequenceEncoder;
    } else if (mediaType === 'JPEG Sequence') {
      Encoder = JPEGSequenceEncoder;
    } else if (mediaType === 'GIF') {
      Encoder = GifEncoder;
    }

    adapter.render(Encoder, encoderSettings, onStop, this.getCameraKeyframes);
  }

  render() {
    const {exportVideoWidth, handleClose, mapData} = this.props;
    const settingsData = {
      mediaType: this.state.mediaType,
      cameraPreset: this.state.cameraPreset,
      fileName: this.state.fileName,
      resolution: this.state.quality
    };

    const {adapter} = this.state;

    return (
      <ExportVideoPanel
        // UI Props
        exportVideoWidth={exportVideoWidth}
        handleClose={handleClose}
        // Map Props
        mapData={mapData}
        setViewState={viewState => {
          this.setState({viewState});
        }}
        // Settings Props
        settingsData={settingsData}
        setMediaTypeState={this.setMediaTypeState}
        setCameraPreset={this.setCameraPreset}
        setFileName={this.setFileName}
        setQuality={this.setQuality}
        // Hubble Props
        adapter={adapter}
        handlePreviewVideo={this.onPreviewVideo}
        handleRenderVideo={this.onRenderVideo}
      />
    );
  }
}
