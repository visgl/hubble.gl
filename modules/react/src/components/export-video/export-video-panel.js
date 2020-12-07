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

import {
  DEFAULT_PADDING,
  DEFAULT_ICON_BUTTON_HEIGHT,
  DEFAULT_ROW_GAP,
  DEFAULT_SETTINGS_WIDTH
} from './constants';
import ExportVideoPanelSettings from './export-video-panel-settings';
import {ExportVideoPanelPreview} from './export-video-panel-preview'; // Not yet part of standard library. TODO when updated
import ExportVideoPanelFooter from './export-video-panel-footer';

import {WithKeplerUI} from '../inject-kepler';

const PanelCloseInner = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${DEFAULT_PADDING}px ${DEFAULT_PADDING}px 0 ${DEFAULT_PADDING}px;
`;

const PanelClose = ({handleClose}) => (
  <WithKeplerUI>
    {({IconButton, Icons}) => (
      <PanelCloseInner className="export-video-panel__close">
        <IconButton className="export-video-panel__button" link onClick={handleClose}>
          <Icons.Delete height={DEFAULT_ICON_BUTTON_HEIGHT} />
        </IconButton>
      </PanelCloseInner>
    )}
  </WithKeplerUI>
);

const StyledTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  line-height: ${props => props.theme.lineHeight};
  padding: 0 ${DEFAULT_PADDING}px 16px ${DEFAULT_PADDING}px;
`;

const PanelBodyInner = styled.div`
  padding: 0 ${DEFAULT_PADDING}px;
  display: grid;
  grid-template-columns: ${props => props.exportVideoWidth}px ${DEFAULT_SETTINGS_WIDTH}px;
  grid-template-rows: auto;
  grid-column-gap: ${DEFAULT_ROW_GAP}px;
`;

const PanelBody = ({
  exportVideoWidth,
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
  <PanelBodyInner className="export-video-panel__body" exportVideoWidth={exportVideoWidth}>
    <ExportVideoPanelPreview
      mapData={mapData}
      adapter={adapter}
      setViewState={setViewState}
      exportVideoWidth={exportVideoWidth}
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
    {/* TODO: inject additional keyframing tools here */}
  </PanelBodyInner>
);

const Panel = styled.div`
  width: ${props =>
    props.exportVideoWidth + 2 * DEFAULT_PADDING + DEFAULT_ROW_GAP + DEFAULT_SETTINGS_WIDTH}px;
`;

const ExportVideoPanel = ({
  // UI Props
  exportVideoWidth,
  handleClose,
  header,
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
    <Panel exportVideoWidth={exportVideoWidth} className="export-video-panel">
      {header !== false ? (
        <>
          <PanelClose handleClose={handleClose} />
          <StyledTitle className="export-video-panel__title">Export Video</StyledTitle>
        </>
      ) : null}
      <PanelBody
        exportVideoWidth={exportVideoWidth}
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
  );
};

export default withTheme(ExportVideoPanel);
