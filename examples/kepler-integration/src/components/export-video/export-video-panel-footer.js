import React from 'react';
import styled, {withTheme} from 'styled-components';
import {
  DEFAULT_PADDING,
  DEFAULT_ROW_GAP,
  DEFAULT_BUTTON_HEIGHT,
  DEFAULT_BUTTON_WIDTH
} from './constants';
import {Button} from 'kepler.gl/components';

const PanelFooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${DEFAULT_ROW_GAP};
  padding: ${DEFAULT_PADDING};
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const ExportVideoPanelFooter = ({handleClose, handlePreviewVideo, handleRenderVideo}) => (
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

export default withTheme(ExportVideoPanelFooter);
