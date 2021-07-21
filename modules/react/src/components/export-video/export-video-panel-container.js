// Copyright (c) 2021 Uber Technologies, Inc.
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
  KeplerAnimation,
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';

import ExportVideoPanel from './export-video-panel';
import {parseSetCameraType, scaleToVideoExport} from './utils';
import {DEFAULT_FILENAME, getResolutionSetting} from './constants';

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
    this.onPreviewVideo = this.onPreviewVideo.bind(this);
    this.onRenderVideo = this.onRenderVideo.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.getCameraKeyframes = this.getCameraKeyframes.bind(this);
    this.getFilterKeyframes = this.getFilterKeyframes.bind(this);
    this.getTripKeyframes = this.getTripKeyframes.bind(this);

    const {
      initialState,
      mapData: {mapState},
      glContext
    } = props;

    this.state = {
      mediaType: 'gif',
      cameraPreset: 'None',
      fileName: '',
      resolution: '1280x720',
      durationMs: 1000,
      rendering: false, // Will set a spinner overlay if true
      previewing: false,
      ...(initialState || {})
    };
    const viewState = scaleToVideoExport(mapState, this._getContainer());
    this.state.viewState = viewState;
    this.state.memo = {viewState};
    this.state.adapter = new DeckAdapter({glContext});
  }

  componentDidMount() {
    const {onTripFrameUpdate, onFilterFrameUpdate} = this.props;
    const animation = new KeplerAnimation({
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes(),
      onCameraFrameUpdate: this.setViewState,
      onTripFrameUpdate,
      onFilterFrameUpdate
    });
    this.state.adapter.animationManager.attachAnimation(animation);
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

  _getContainer() {
    const {width, height} = this.getCanvasSize();
    const {exportVideoWidth} = this.props;
    const aspectRatio = width / height;
    return {height: exportVideoWidth / aspectRatio, width: exportVideoWidth};
  }

  getFormatConfigs() {
    const {width, height} = this.getCanvasSize();

    return {
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
      }
    };
  }

  getTimecode() {
    const {durationMs} = this.state;
    return {
      start: 0,
      end: durationMs,
      framerate: 30
    };
  }

  getEncoder() {
    const {mediaType} = this.state;
    return ENCODERS[mediaType];
  }

  getCameraKeyframes() {
    const {viewState, cameraPreset, durationMs} = this.state;
    const {longitude, latitude, zoom, pitch, bearing} = viewState;

    return {
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
    };
  }

  getFilterKeyframes() {
    const {
      mapData: {
        visState: {filters}
      }
    } = this.props;
    // only animate an enlarged time filter.
    const filterKeyframes = filters
      .filter(f => f.type === 'timeRange' && f.enlarged)
      .map(f => ({
        id: f.id,
        timings: [0, this.state.durationMs]
      }));

    if (filterKeyframes.length) {
      return {
        filters,
        filterKeyframes
      };
    }
    return {};
  }

  getTripKeyframes() {
    const {
      mapData: {
        visState: {layers, animationConfig}
      }
    } = this.props;

    const animatableLayer = layers.filter(
      l => l.config.animation && l.config.animation.enabled && l.config.isVisible
    );
    const readyToAnimation =
      Array.isArray(animationConfig.domain) && Number.isFinite(animationConfig.currentTime);
    const showAnimationControl = animatableLayer.length && readyToAnimation;
    if (showAnimationControl) {
      return {
        animationConfig,
        tripKeyframe: {timings: [0, this.state.durationMs]}
      };
    }
    return {};
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

  setViewState(viewState) {
    this.setState({viewState});
  }

  onPreviewVideo() {
    const {adapter} = this.state;
    const filename = this.getFileName();
    const formatConfigs = this.getFormatConfigs();
    const timecode = this.getTimecode();
    this.setState({previewing: true, memo: {viewState: {...this.state.viewState}}});
    const onStop = () => {
      this.setState({previewing: false, viewState: {...this.state.memo.viewState}});
    };
    adapter.animationManager.setKeyframes('kepler', {
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes()
    });
    adapter.render({
      Encoder: PreviewEncoder,
      formatConfigs,
      timecode,
      filename,
      onStop
    });
  }

  onRenderVideo() {
    const {adapter} = this.state;
    const filename = this.getFileName();
    const Encoder = this.getEncoder();
    const formatConfigs = this.getFormatConfigs();
    const timecode = this.getTimecode();

    // Enables overlay after user clicks "Render"
    this.setState({rendering: true, memo: {viewState: {...this.state.viewState}}});
    const onStop = () => {
      // Disables overlay once export is done saving (generates file to download)
      this.setState({rendering: false, viewState: {...this.state.memo.viewState}});
    };
    adapter.animationManager.setKeyframes('kepler', {
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes()
    });
    adapter.render({
      Encoder,
      formatConfigs,
      timecode,
      filename,
      onStop
    });
  }

  setDuration(durationMs) {
    this.setStateAndNotify({durationMs});
  }

  render() {
    const {
      exportVideoWidth,
      handleClose,
      mapData,
      header,
      deckProps,
      staticMapProps,
      mapboxLayerBeforeId
    } = this.props;
    const {
      adapter,
      durationMs,
      mediaType,
      cameraPreset,
      fileName,
      resolution,
      viewState,
      rendering
    } = this.state;

    const timecode = this.getTimecode();
    const settings = {
      mediaType,
      setMediaType: this.setMediaType,
      cameraPreset,
      setCameraPreset: this.setCameraPreset,
      fileName,
      setFileName: this.setFileName,
      resolution,
      setResolution: this.setResolution,
      durationMs,
      setDuration: this.setDuration,
      frameRate: timecode.framerate
    };

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
        deckProps={deckProps}
        staticMapProps={staticMapProps}
        mapboxLayerBeforeId={mapboxLayerBeforeId}
        // Settings Props
        settings={settings}
        // Hubble Props
        adapter={adapter}
        handlePreviewVideo={this.onPreviewVideo}
        handleRenderVideo={this.onRenderVideo}
        resolution={[width, height]}
        rendering={rendering}
      />
    );
  }
}

ExportVideoPanelContainer.defaultProps = {
  exportVideoWidth: 540,
  header: true,
  glContext: undefined,
  deckProps: {},
  staticMapProps: {}
};
