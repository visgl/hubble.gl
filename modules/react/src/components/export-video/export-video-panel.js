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

import React from 'react';
import styled, {withTheme} from 'styled-components';
import {PanelCloseInner, StyledTitle} from './styled-components';

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
  settings,
  resolution,
  viewState,
  rendering,
  deckProps,
  staticMapProps,
  mapboxLayerBeforeId
}) => (
  <PanelBodyInner className="export-video-panel__body" exportVideoWidth={exportVideoWidth}>
    <ExportVideoPanelPreview
      mapData={mapData}
      adapter={adapter}
      setViewState={setViewState}
      exportVideoWidth={exportVideoWidth}
      resolution={resolution}
      viewState={viewState}
      rendering={rendering}
      durationMs={settings.durationMs}
      deckProps={deckProps}
      staticMapProps={staticMapProps}
      mapboxLayerBeforeId={mapboxLayerBeforeId}
    />
    <ExportVideoPanelSettings settings={settings} resolution={resolution} />
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
  mapboxLayerBeforeId,
  // Settings Props
  settings,
  // Hubble Props
  adapter,
  handlePreviewVideo,
  handleRenderVideo,
  resolution,
  viewState,
  rendering,
  deckProps,
  staticMapProps
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
        settings={settings}
        setViewState={setViewState}
        resolution={resolution}
        viewState={viewState}
        rendering={rendering}
        deckProps={deckProps}
        staticMapProps={staticMapProps}
        mapboxLayerBeforeId={mapboxLayerBeforeId}
      />
      <ExportVideoPanelFooter
        handlePreviewVideo={handlePreviewVideo}
        handleRenderVideo={handleRenderVideo}
        rendering={rendering}
      />
    </Panel>
  );
};

export default withTheme(ExportVideoPanel);
