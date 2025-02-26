// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React, {Component} from 'react';
import {easeInOut} from 'popmotion';
import {
  DeckAdapter,
  KeplerAnimation,
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder,
  FormatConfigs,
  Timecode
} from '@hubble.gl/core';

import ExportVideoPanel from './export-video-panel';
import {parseSetCameraType, scaleToVideoExport} from './utils';
import {DEFAULT_FILENAME, getResolutionSetting} from './constants';
import type {MapProps} from 'react-map-gl';
import type {DeckProps, MapViewState} from '@deck.gl/core/typed';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';

const ENCODERS = {
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

export type ExportVideoSettings = {
  mediaType?: string;
  cameraPreset?: string;
  fileName?: string;
  resolution?: string;
  durationMs?: number;
};

type ExportVideoPanelContainerProps = {
  initialState?: Partial<ExportVideoPanelContainerState>;
  glContext?: WebGLRenderingContext;

  exportVideoWidth: number;
  handleClose: () => void;
  mapData: any;
  header: boolean;
  deckProps?: DeckProps;
  mapProps: MapProps;
  disableBaseMap: boolean;
  mapboxLayerBeforeId?: string;
  defaultFileName: string;

  animatableFilters;

  onTripFrameUpdate;
  onFilterFrameUpdate;
  getTimeRangeFilterKeyframes;

  onSettingsChange: (settings: ExportVideoSettings) => void;
};

type ExportVideoPanelContainerState = {
  adapter?: DeckAdapter;
  durationMs: number;
  mediaType: string;
  cameraPreset: string;
  fileName: string;
  resolution: string;
  viewState?: MapViewState;
  rendering: boolean;
  previewing: boolean;
  saving: boolean;
  memo?: {viewState: MapViewState};
};

export class ExportVideoPanelContainer extends Component<
  ExportVideoPanelContainerProps,
  ExportVideoPanelContainerState
> {
  constructor(props: ExportVideoPanelContainerProps) {
    super(props);

    this.setMediaType = this.setMediaType.bind(this);
    this.setCameraPreset = this.setCameraPreset.bind(this);
    this.setFileName = this.setFileName.bind(this);
    this.setResolution = this.setResolution.bind(this);
    this.setViewState = this.setViewState.bind(this);
    this.onPreviewVideo = this.onPreviewVideo.bind(this);
    this.onRenderVideo = this.onRenderVideo.bind(this);
    this.onStop = this.onStop.bind(this);
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
      saving: false,
      ...(initialState || {})
    };
    const viewState = scaleToVideoExport(mapState, this._getContainer());
    this.state = {
      ...this.state,
      viewState,
      memo: {viewState},
      adapter: new DeckAdapter({glContext})
    };
  }

  componentDidMount() {
    const {onTripFrameUpdate, onFilterFrameUpdate, getTimeRangeFilterKeyframes} = this.props;
    const animation = new KeplerAnimation({
      ...this.getFilterKeyframes(),
      ...this.getTripKeyframes(),
      cameraKeyframe: this.getCameraKeyframes(),
      onCameraFrameUpdate: this.setViewState,
      onTripFrameUpdate,
      onFilterFrameUpdate,
      getTimeRangeFilterKeyframes
    });
    this.state.adapter.animationManager.attachAnimation(animation);
  }

  componentWillUnmount() {
    this.onStop({abort: true});
  }

  getFileName() {
    const {defaultFileName} = this.props;
    const {fileName} = this.state;
    if (fileName === '') return defaultFileName;
    return fileName;
  }

  getCanvasSize() {
    const {resolution} = this.state;
    const {width, height} = getResolutionSetting(resolution);
    return {width, height};
  }

  _getContainer() {
    const {width, height} = this.getCanvasSize();
    const {exportVideoWidth} = this.props;
    const aspectRatio = width / height;
    return {height: exportVideoWidth / aspectRatio, width: exportVideoWidth};
  }

  getFormatConfigs(): Partial<FormatConfigs> {
    const {width, height} = this.getCanvasSize();

    return {
      webm: {
        quality: 0.8
      },
      jpeg: {
        quality: 0.8
      },
      png: {},
      gif: {
        sampleInterval: 1000,
        width,
        height
      }
    };
  }

  getTimecode(): Timecode {
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
    const {width, height} = this.getCanvasSize();

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
      easings: [easeInOut],
      width,
      height
    };
  }

  getFilterKeyframes() {
    const {
      mapData: {
        visState: {filters}
      },
      animatableFilters
    } = this.props;

    const filterKeyframes = (
      Array.isArray(animatableFilters) && animatableFilters.length
        ? animatableFilters
        : // only animate an enlarged time filter if animatable filters aren't specified.
          filters.filter(f => f.type === 'timeRange' && f.view === FILTER_VIEW_TYPES.enlarged)
    ).map(f => ({
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

  setStateAndNotify(update: ExportVideoSettings) {
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

  setMediaType(mediaType: string) {
    this.setStateAndNotify({mediaType});
  }

  setCameraPreset(cameraPreset: string) {
    this.setStateAndNotify({cameraPreset});
  }

  setFileName(fileName: string) {
    this.setStateAndNotify({fileName});
  }

  setResolution(resolution: string) {
    this.setStateAndNotify({resolution});
  }

  setViewState(viewState: MapViewState) {
    this.setState({viewState});
  }

  onPreviewVideo() {
    const {adapter} = this.state;
    const filename = this.getFileName();
    const formatConfigs = this.getFormatConfigs();
    const timecode = this.getTimecode();
    this.setState({previewing: true, memo: {viewState: {...this.state.viewState}}});
    const onComplete = () => {
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
      onComplete
    });
  }

  onRenderVideo() {
    const {adapter} = this.state;
    const filename = this.getFileName();
    const Encoder = this.getEncoder();
    const formatConfigs = this.getFormatConfigs();
    const timecode = this.getTimecode();

    // Enables overlay after user clicks "Render"
    this.setState({rendering: true, saving: false, memo: {viewState: {...this.state.viewState}}});
    const onComplete = () => {
      // Disables overlay once export is done saving (generates file to download)
      this.setState({rendering: false, saving: false, viewState: {...this.state.memo.viewState}});
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
      onStopped: () => this.setState({saving: true}),
      onComplete
    });
  }

  onStop({abort = false}) {
    const {adapter} = this.state;
    adapter.stop({
      abort,
      onStopped: () => this.setState({saving: true}),
      onComplete: () => {
        this.setState({
          previewing: false,
          rendering: false,
          viewState: {...this.state.memo.viewState}
        });
      }
    });
  }

  setDuration(durationMs: number) {
    this.setStateAndNotify({durationMs});
  }

  render() {
    const {
      exportVideoWidth,
      handleClose,
      mapData,
      header,
      deckProps,
      mapProps,
      disableBaseMap,
      mapboxLayerBeforeId,
      defaultFileName
    } = this.props;
    const {
      adapter,
      durationMs,
      mediaType,
      cameraPreset,
      fileName,
      resolution,
      viewState,
      rendering,
      previewing,
      saving
    } = this.state;

    const timecode = this.getTimecode();
    const settings = {
      mediaType,
      setMediaType: this.setMediaType,
      cameraPreset,
      setCameraPreset: this.setCameraPreset,
      fileName,
      setFileName: this.setFileName,
      fileNamePlaceholder: defaultFileName,
      resolution,
      setResolution: this.setResolution,
      durationMs,
      setDuration: this.setDuration,
      frameRate: timecode.framerate
    };

    let canvasSize = this.getCanvasSize();
    if (previewing) {
      // set resolution to be 1:1 with container when previewing to improve performance.
      canvasSize = this._getContainer();
    }

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
        mapProps={mapProps}
        disableBaseMap={disableBaseMap}
        mapboxLayerBeforeId={mapboxLayerBeforeId}
        // Settings Props
        settings={settings}
        // Hubble Props
        adapter={adapter}
        resolution={[canvasSize.width, canvasSize.height]}
        handlePreviewVideo={this.onPreviewVideo}
        handleRenderVideo={this.onRenderVideo}
        handleStop={this.onStop}
        rendering={rendering}
        previewing={previewing}
        saving={saving}
      />
    );
  }
}

// @ts-ignore
ExportVideoPanelContainer.defaultProps = {
  exportVideoWidth: 540,
  header: true,
  glContext: undefined,
  deckProps: {},
  mapProps: {},
  disableStaticMap: false,
  defaultFileName: DEFAULT_FILENAME
};
