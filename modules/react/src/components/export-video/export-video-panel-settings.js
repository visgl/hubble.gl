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
  DEFAULT_FILENAME,
  FORMATS,
  RESOLUTIONS
} from './constants';

import {msConversion, estimateFileSize} from './utils';

import {WithKeplerUI} from '../inject-kepler';

const StyledSection = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 500;
  font-size: 13px;
  margin-top: ${props => (props.top ? '0px' : `${DEFAULT_PADDING}px`)};
  margin-bottom: ${DEFAULT_ROW_GAP}px;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-right: 24px;
  margin-left: 24px;
`;

const StyledLabelCell = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 400;
  font-size: 11px;
`;

const StyledValueCell = styled.div`
  align-self: center;
  color: ${props => props.theme.textColor};
  font-weight: 500;
  font-size: 11px;
  padding: 0 12px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 88px auto;
  grid-template-rows: repeat(
    ${props => props.rows},
    ${props => (props.rowHeight ? props.rowHeight : '34px')}
  );
  grid-row-gap: ${DEFAULT_ROW_GAP}px;
`;

const getOptionValue = r => r.value;
const displayOption = r => r.label;
const getSelectedItems = (options, value) => options.find(o => o.value === value);

const ExportVideoPanelSettings = ({
  setMediaType,
  setCameraPreset,
  setFileName,
  setResolution,
  settingsData,
  durationMs,
  frameRate,
  resolution,
  mediaType,
  setDuration
}) => (
  <WithKeplerUI>
    {({Input, ItemSelector, Slider}) => (
      <div>
        <StyledSection top={true}>Export Settings</StyledSection>
        <InputGrid rows={5}>
          <StyledLabelCell>File Name</StyledLabelCell>
          <Input
            value={settingsData.fileName}
            placeholder={DEFAULT_FILENAME}
            onChange={e => setFileName(e.target.value)}
          />
          <StyledLabelCell>Media Type</StyledLabelCell>
          <ItemSelector
            selectedItems={getSelectedItems(FORMATS, settingsData.mediaType)}
            options={FORMATS}
            getOptionValue={getOptionValue}
            displayOption={displayOption}
            multiSelect={false}
            searchable={false}
            onChange={setMediaType}
          />
          <StyledLabelCell>Resolution</StyledLabelCell>
          <ItemSelector
            selectedItems={getSelectedItems(RESOLUTIONS, settingsData.resolution)}
            options={RESOLUTIONS}
            getOptionValue={getOptionValue}
            displayOption={displayOption}
            multiSelect={false}
            searchable={false}
            onChange={setResolution}
          />
          <StyledLabelCell>Duration</StyledLabelCell>
          <StyledValueCell>
            <SliderWrapper
              style={{width: '100%', marginLeft: '0px'}}
              className="modal-duration__slider"
            >
              <Slider
                showValues={false}
                enableBarDrag={true}
                isRanged={false}
                value1={durationMs}
                step={100}
                minValue={100}
                maxValue={10000}
                style={{width: '70px'}}
                onSlider1Change={val => {
                  setDuration(val);
                }}
              />
              <div style={{alignSelf: 'center', paddingLeft: '8px', width: '56px'}}>
                {msConversion(durationMs)}
              </div>
            </SliderWrapper>
          </StyledValueCell>
          <StyledLabelCell>File Size</StyledLabelCell>
          <StyledValueCell>
            {estimateFileSize(frameRate, resolution, durationMs, mediaType)}
          </StyledValueCell>
        </InputGrid>
        <StyledSection>Video Effects</StyledSection>
        <InputGrid rows={1}>
          <StyledLabelCell>Camera</StyledLabelCell>
          <ItemSelector
            selectedItems={settingsData.cameraPreset}
            options={[
              'None',
              'Orbit (90º)',
              'Orbit (180º)',
              'Orbit (360º)',
              'North to South',
              'South to North',
              'East to West',
              'West to East',
              'Zoom Out',
              'Zoom In'
            ]}
            multiSelect={false}
            searchable={false}
            onChange={setCameraPreset}
          />
        </InputGrid>
      </div>
    )}
  </WithKeplerUI>
);

export default withTheme(ExportVideoPanelSettings);
