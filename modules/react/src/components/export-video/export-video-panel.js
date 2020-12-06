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

import React from 'react';
import styled, {withTheme} from 'styled-components';
import {IntlProvider} from 'react-intl';

import {messages} from 'kepler.gl/localization';
import {Button, Icons} from 'kepler.gl/components';

import {DEFAULT_PADDING, DEFAULT_ICON_BUTTON_HEIGHT} from './constants';
import ExportVideoPanelSettings from './export-video-panel-settings';
import {ExportVideoPanelPreview} from './export-video-panel-preview'; // Not yet part of standard library. TODO when updated
import ExportVideoPanelFooter from './export-video-panel-footer';

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

const PanelClose = ({handleClose}) => (
  <PanelCloseInner className="export-video-panel__close">
    <IconButton className="export-video-panel__button" link onClick={handleClose}>
      <Icons.Delete height={DEFAULT_ICON_BUTTON_HEIGHT} />
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
  adapter,
  setViewState,
  setMediaType,
  setCameraPreset,
  setFileName,
  setResolution,
  settingsData,
  durationMs,
  frameRate,
  resolution,
  mediaType,
  viewState,
  setDuration
}) => (
  <PanelBodyInner className="export-video-panel__body">
    <ExportVideoPanelPreview
      mapData={mapData}
      adapter={adapter}
      setViewState={setViewState}
      resolution={resolution}
      viewState={viewState}
    />
    <ExportVideoPanelSettings
      setMediaType={setMediaType}
      setCameraPreset={setCameraPreset}
      setFileName={setFileName}
      setResolution={setResolution}
      settingsData={settingsData}
      durationMs={durationMs}
      frameRate={frameRate}
      resolution={resolution}
      mediaType={mediaType}
      setDuration={setDuration}
    />
  </PanelBodyInner>
);

const Panel = styled.div`
  width: ${props => props.exportVideoWidth}px;
`;

const ExportVideoPanel = ({
  // UI Props
  exportVideoWidth,
  handleClose,
  // Map Props
  mapData,
  setViewState,
  // Settings Props
  settingsData,
  setMediaType,
  setCameraPreset,
  setFileName,
  setResolution,
  // Hubble Props
  adapter,
  handlePreviewVideo,
  handleRenderVideo,
  durationMs,
  frameRate,
  resolution,
  mediaType,
  viewState,
  setDuration
}) => {
  return (
    <IntlProvider locale="en" messages={messages.en}>
      <Panel exportVideoWidth={exportVideoWidth} className="export-video-panel">
        <PanelClose handleClose={handleClose} />
        <StyledTitle className="export-video-panel__title">Export Video</StyledTitle>
        <PanelBody
          mapData={mapData}
          adapter={adapter}
          setMediaType={setMediaType}
          setCameraPreset={setCameraPreset}
          setFileName={setFileName}
          setResolution={setResolution}
          settingsData={settingsData}
          setViewState={setViewState}
          durationMs={durationMs}
          frameRate={frameRate}
          resolution={resolution}
          mediaType={mediaType}
          viewState={viewState}
          setDuration={setDuration}
        />
        <ExportVideoPanelFooter
          handleClose={handleClose}
          handlePreviewVideo={handlePreviewVideo}
          handleRenderVideo={handleRenderVideo}
        />
      </Panel>
    </IntlProvider>
  );
};

export default withTheme(ExportVideoPanel);
