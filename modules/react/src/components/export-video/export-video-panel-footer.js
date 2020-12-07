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
  DEFAULT_ROW_GAP,
  DEFAULT_BUTTON_HEIGHT,
  DEFAULT_BUTTON_WIDTH
} from './constants';
import {WithKeplerUI} from '../inject-kepler';

const PanelFooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${DEFAULT_ROW_GAP}px;
  padding: ${DEFAULT_PADDING}px;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const ExportVideoPanelFooter = ({handleClose, handlePreviewVideo, handleRenderVideo}) => (
  <WithKeplerUI>
    {({Button}) => (
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
    )}
  </WithKeplerUI>
);

export default withTheme(ExportVideoPanelFooter);
