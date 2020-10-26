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
import styled, {withTheme} from 'styled-components';
import {Button, Icons} from 'kepler.gl/components';

import {sceneBuilder} from './scene'; // Not yet part of standard library. TODO when updated
import ExportVideoPanelSettings from './export-video-panel-settings';
import {ExportVideoPanelPreview} from './export-video-panel-preview'; // Not yet part of standard library. TODO when updated
import {parseSetCameraType} from './parse-set-camera-type';

import {CameraKeyframes} from '@hubble.gl/core';
import {easing} from 'popmotion';

import {
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder
  // GifEncoder
} from '@hubble.gl/core';
import {DeckAdapter} from 'hubble.gl';

import {DEFAULT_TIME_FORMAT} from 'kepler.gl';
import moment from 'moment';
import {messages} from 'kepler.gl/localization';
import {IntlProvider} from 'react-intl';

const DEFAULT_BUTTON_HEIGHT = '32px';
const DEFAULT_BUTTON_WIDTH = '64px';
const DEFAULT_PADDING = '32px';
const DEFAULT_ROW_GAP = '16px';

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 1,
  pitch: 30,
  bearing: 0
};

const adapter = new DeckAdapter(sceneBuilder);

const encoderSettings = {
  framerate: 30,
  webm: {
    quality: 0.8
  },
  jpeg: {
    quality: 0.8
  },
  gif: {
    sampleInterval: 1000
  },
  filename: `${'Default Video Name' + ' '}${moment()
    .format(DEFAULT_TIME_FORMAT)
    .toString()}`
};

function preview(updateCamera) {
  adapter.render(PreviewEncoder, encoderSettings, () => {}, updateCamera);
}

function setFileNameDeckAdapter(name) {
  encoderSettings.filename = `${name} ${moment()
    .format(DEFAULT_TIME_FORMAT)
    .toString()}`;
}

/* function setResolution(resolution){
  if(resolution === 'Good (540p)'){
    adapter.scene.width = 960;
    adapter.scene.height = 540;
  }else if(resolution === 'High (720p)'){
    adapter.scene.width = 1280;
    adapter.scene.height = 720;
  }else if(resolution === 'Highest (1080p)'){
    adapter.scene.width = 1920;
    adapter.scene.height = 1080;
  }
}*/

// This is temporary, for showing purposes on Friday, resolution settings should be in a separate function,
// only because we are against the clock.
// TODO: refactor
function render(settingsdata, updateCamera) {
  //  setResolution(settingsdata.resolution); // Remove this

  if (settingsdata.mediaType === 'WebM Video') {
    adapter.render(WebMEncoder, encoderSettings, () => {}, updateCamera);
  } else if (settingsdata.mediaType === 'PNG Sequence') {
    adapter.render(PNGSequenceEncoder, encoderSettings, () => {}, updateCamera);
  } else if (settingsdata.mediaType === 'JPEG Sequence') {
    adapter.render(JPEGSequenceEncoder, encoderSettings, () => {}, updateCamera);
  }
}

// TODO:

// Changes Timestamp function
// Camera function (preset keyframes) DONE
// File Name function DONE
// MediaType function DONE
// Quality function
// Set Duration function
// Calculate File Size function
// Render Function DONE

const IconButton = styled(Button)`
  padding: 0;
  svg {
    margin: 0;
  }
`;

const PanelCloseInner = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${DEFAULT_PADDING} ${DEFAULT_PADDING} 0 ${DEFAULT_PADDING};
`;

const PanelClose = ({buttonHeight, handleClose}) => (
  <PanelCloseInner className="export-video-panel__close">
    <IconButton
      className="export-video-panel__button"
      link
      onClick={() => {
        handleClose();
      }}
    >
      <Icons.Delete height={buttonHeight} />
    </IconButton>
  </PanelCloseInner>
);

const StyledTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  line-height: ${props => props.theme.lineHeight};
  padding: 0 ${DEFAULT_PADDING} 16px ${DEFAULT_PADDING};
`;

const PanelBodyInner = styled.div`
  padding: 0 ${DEFAULT_PADDING};
  display: grid;
  grid-template-columns: 480px auto;
  grid-template-rows: 460px;
  grid-column-gap: 20px;
`;

const PanelBody = ({
  mapData,
  setViewState,
  setMediaType,
  setCamera,
  setFileName /* , setQuality*/,
  settingsData
}) => (
  <PanelBodyInner className="export-video-panel__body">
    <ExportVideoPanelPreview
      mapData={mapData}
      encoderSettings={encoderSettings}
      adapter={adapter}
      setViewState={setViewState} /* ref={sce}*/
    />
    <ExportVideoPanelSettings 
      setMediaType={setMediaType}
      setCamera={setCamera}
      setFileName={setFileName} /* , setQuality*/
      settingsData={settingsData}
    />
  </PanelBodyInner>
);

const PanelFooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${DEFAULT_ROW_GAP};
  padding: ${DEFAULT_PADDING};
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const PanelFooter = ({handleClose, handlePreviewVideo, handleRenderVideo}) => (
  <PanelFooterInner className="export-video-panel__footer">
    <Button
      width={DEFAULT_BUTTON_WIDTH}
      height={DEFAULT_BUTTON_HEIGHT}
      secondary
      className={'export-video-button'}
      onClick={handlePreviewVideo}
    >
      Preview
    </Button>
    <ButtonGroup>
      <Button
        width={DEFAULT_BUTTON_WIDTH}
        height={DEFAULT_BUTTON_HEIGHT}
        link
        className={'export-video-button'}
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button
        width={DEFAULT_BUTTON_WIDTH}
        height={DEFAULT_BUTTON_HEIGHT}
        className={'export-video-button'}
        onClick={handleRenderVideo}
      >
        Render
      </Button>
    </ButtonGroup>
  </PanelFooterInner>
);

const Panel = styled.div`
  width: ${props => props.settingsWidth}px;
`;

class ExportVideoPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaType: 'WebM Video',
      camera: 'None',
      fileName: 'Video Name', 
      //  quality: "High (720p)",
      viewState: INITIAL_VIEW_STATE
    };

    this.setMediaTypeState = this.setMediaTypeState.bind(this);
    this.setCamera = this.setCamera.bind(this);
    this.setFileName = this.setFileName.bind(this);
    // this.setQuality = this.setQuality.bind(this);
    this.updateCamera = this.updateCamera.bind(this);
    this.onPreviewVideo = this.onPreviewVideo.bind(this);
    this.onRenderVideo = this.onRenderVideo.bind(this);
  }

  static defaultProps = {
    settingsWidth: 980,
    buttonHeight: '16px'
  };

  updateCamera(prevCamera) {
    const viewState = this.state.viewState;
    const strCameraType = this.state.camera;

    // Set by User
    prevCamera = new CameraKeyframes({
      timings: [0, 1000], // TODO change to 5000 later. 1000 for dev testing
      keyframes: [
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing
        },
        parseSetCameraType(strCameraType, viewState)
      ],
      easings: [easing.easeInOut]
    });
    return prevCamera;
  }

  setMediaTypeState(media) {
    this.setState({
      mediaType: media
    });
  }
  setCamera(option) {
    this.setState({
      camera: option
    });
  }
  setFileName(name) {
    this.setState({
      fileName: name.target.value
    });
    setFileNameDeckAdapter(name.target.value);
  }
  /* setQuality(resolution){
    this.setState({
      quality: resolution
    });
    setResolution(resolution);
  }*/

  onPreviewVideo() {
    preview(this.updateCamera)
  }

  onRenderVideo() {
    const settingsData = {
      mediaType: this.state.mediaType,
      camera: this.state.camera,
      fileName: this.state.fileName,
      resolution: this.state.quality
    };
    render(settingsData, this.updateCamera)
  }

  render() {
    const {buttonHeight, settingsWidth, handleClose} = this.props;
    const settingsData = {
      mediaType: this.state.mediaType,
      camera: this.state.camera,
      fileName: this.state.fileName,
      resolution: this.state.quality
    };

    return (
      <IntlProvider locale="en" messages={messages.en}>
        <Panel settingsWidth={settingsWidth} className="export-video-panel">
          <PanelClose buttonHeight={buttonHeight} handleClose={handleClose} />{' '}
          {/* handleClose for X button */}
          <StyledTitle className="export-video-panel__title">Export Video</StyledTitle>
          <PanelBody
            mapData={this.props.mapData}
            setMediaType={this.setMediaTypeState}
            setCamera={this.setCamera}
            setFileName={this.setFileName}
            //  setQuality={this.setQuality}
            settingsData={settingsData}
            setViewState={viewState => {
              this.setState({viewState});
            }}
          />
          <PanelFooter
            handleClose={handleClose}
            handlePreviewVideo={this.onPreviewVideo}
            handleRenderVideo={this.onRenderVideo}
          />{' '}
          {/* handleClose for Cancel button */}
        </Panel>
      </IntlProvider>
    );
  }
}

export default withTheme(ExportVideoPanel);
