// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React from 'react';
import {withTheme} from 'styled-components';
import {
  PanelCloseInner,
  StyledTitle,
  PanelBodyInner,
  Panel,
  ButtonGroup,
  TimelineControls,
  timelinePlayButtonStyle,
  ExportVideoPanelHeader
} from './styled-components';

import {DEFAULT_ICON_BUTTON_HEIGHT} from './constants';
import ExportVideoPanelSettings, {ExportVideoSettings} from './export-video-panel-settings';
import {ExportVideoPanelPreview, ExportVideoPanelPreviewProps} from './export-video-panel-preview';

import {Play, Stop} from '../icons/index';

import {WithKeplerUI} from '../inject-kepler';

const PanelClose = ({handleClose}: {handleClose: () => void}) => (
  <WithKeplerUI>
    {({IconButton, Icons}) => (
      <PanelCloseInner className="export-video-panel__close">
        <IconButton
          style={{alignItems: 'start'}}
          className="export-video-panel__button"
          link
          onClick={handleClose}
        >
          <Icons.Delete height={DEFAULT_ICON_BUTTON_HEIGHT} />
        </IconButton>
      </PanelCloseInner>
    )}
  </WithKeplerUI>
);

type PanelBodyProps = Omit<ExportVideoPanelPreviewProps, 'durationMs'> & {
  settings: ExportVideoSettings;
  previewing: boolean;
  handlePreviewVideo: () => void;
  handleRenderVideo: () => void;
  handleStop: ({abort}: {abort?: boolean}) => void;
};

const PanelBody = ({
  exportVideoWidth,
  mapData,
  adapter,
  setViewState,
  settings,
  resolution,
  viewState,
  deckProps,
  staticMapProps,
  disableStaticMap,
  mapboxLayerBeforeId,
  handlePreviewVideo,
  handleRenderVideo,
  handleStop,
  rendering,
  previewing,
  saving
}: PanelBodyProps) => (
  <WithKeplerUI>
    {({Button}) => (
      <PanelBodyInner className="export-video-panel__body" $exportVideoWidth={exportVideoWidth}>
        <ExportVideoPanelPreview
          mapData={mapData}
          adapter={adapter}
          setViewState={setViewState}
          exportVideoWidth={exportVideoWidth}
          resolution={resolution}
          viewState={viewState}
          rendering={rendering}
          saving={saving}
          durationMs={settings.durationMs}
          deckProps={deckProps}
          staticMapProps={staticMapProps}
          disableStaticMap={disableStaticMap}
          mapboxLayerBeforeId={mapboxLayerBeforeId}
        />
        <ExportVideoPanelSettings
          settings={settings}
          resolution={resolution}
          disabled={rendering || previewing}
        />
        <TimelineControls className="timeline-controls">
          {rendering || previewing ? (
            <Stop style={timelinePlayButtonStyle} onClick={() => handleStop({})} />
          ) : (
            <Play style={timelinePlayButtonStyle} onClick={handlePreviewVideo} />
          )}
        </TimelineControls>
        <ButtonGroup>
          <Button
            style={{marginTop: '16px', width: '100%', height: '32px'}}
            className={'export-video-button'}
            onClick={handleRenderVideo}
            disabled={rendering || previewing}
          >
            Render
          </Button>
        </ButtonGroup>
      </PanelBodyInner>
    )}
  </WithKeplerUI>
);

type ExportVideoPanelProps = PanelBodyProps & {
  theme?: any;
  handleClose: () => void;
  header: boolean;
};

const ExportVideoPanel = ({
  theme,
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
  handleStop,
  rendering,
  previewing,
  saving,
  resolution,
  viewState,
  deckProps,
  staticMapProps,
  disableStaticMap
}: ExportVideoPanelProps) => {
  return (
    <Panel $exportVideoWidth={exportVideoWidth} className="export-video-panel">
      {header !== false ? (
        <ExportVideoPanelHeader className="export-video-panel__header">
          <StyledTitle className="export-video-panel__title">Export Video</StyledTitle>
          <PanelClose handleClose={handleClose} />
        </ExportVideoPanelHeader>
      ) : null}
      <PanelBody
        exportVideoWidth={exportVideoWidth}
        mapData={mapData}
        adapter={adapter}
        settings={settings}
        setViewState={setViewState}
        resolution={resolution}
        viewState={viewState}
        deckProps={deckProps}
        staticMapProps={staticMapProps}
        disableStaticMap={disableStaticMap}
        mapboxLayerBeforeId={mapboxLayerBeforeId}
        handlePreviewVideo={handlePreviewVideo}
        handleRenderVideo={handleRenderVideo}
        handleStop={handleStop}
        rendering={rendering}
        previewing={previewing}
        saving={saving}
      />
    </Panel>
  );
};

// TODO fix with react 18
const ThemedExportVideoPanel: any = withTheme(ExportVideoPanel);

export default ThemedExportVideoPanel;
