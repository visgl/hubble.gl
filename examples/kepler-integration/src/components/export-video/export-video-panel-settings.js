import React, {Component} from 'react';
import {Input, ItemSelector} from 'kepler.gl/components';
import styled, {withTheme} from 'styled-components';

const DEFAULT_PADDING = '32px';
const DEFAULT_ROW_GAP = '16px';

const StyledSection = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 500;
  font-size: 13px;
  margin-top: ${DEFAULT_PADDING};
  margin-bottom: ${DEFAULT_ROW_GAP};
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
  grid-row-gap: ${DEFAULT_ROW_GAP};
`;

const ExportVideoPanelSettings = ({
  setMediaType,
  setCamera,
  setFileName /* , setQuality*/,
  settingsData
}) => (
  <div>
    <StyledSection>Video Effects</StyledSection>
    <InputGrid rows={2}>
    <StyledLabelCell>Timestamp</StyledLabelCell> {/* TODO add functionality  */}
    <ItemSelector
        selectedItems={['None']}
        options={['None', 'White', 'Black']}
        multiSelect={false}
        searchable={false}
        onChange={() => {}}
    />
    <StyledLabelCell>Camera</StyledLabelCell> {/* TODO add functionality */}
    <ItemSelector
        selectedItems={settingsData.camera}
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
        onChange={setCamera}
    />
    </InputGrid>
    <StyledSection>Export Settings</StyledSection> {/* TODO add functionality  */}
    <InputGrid rows={3}>
    <StyledLabelCell>File Name</StyledLabelCell>
    <Input placeholder={settingsData.fileName} onChange={setFileName} />
    <StyledLabelCell>Media Type</StyledLabelCell> {/* TODO add functionality  */}
    <ItemSelector
        selectedItems={settingsData.mediaType}
        options={['WebM Video', 'PNG Sequence', 'JPEG Sequence']}
        multiSelect={false}
        searchable={false}
        onChange={setMediaType}
    />
    <StyledLabelCell>Quality</StyledLabelCell> {/* TODO add functionality  */}
    <ItemSelector
        selectedItems={settingsData.resolution}
        options={['Good (540p)', 'High (720p)', 'Highest (1080p)']}
        multiSelect={false}
        searchable={false}
        onChange={() => {}}
    />
    </InputGrid>
    <InputGrid style={{marginTop: DEFAULT_ROW_GAP}} rows={2} rowHeight="18px">
    <StyledLabelCell>Duration</StyledLabelCell> {/* TODO add functionality  */}
    <StyledValueCell>00:00:30</StyledValueCell>
    <StyledLabelCell>File Size</StyledLabelCell> {/* TODO add functionality  */}
    <StyledValueCell>36 MB</StyledValueCell>
    </InputGrid>
  </div>
)

export default withTheme(ExportVideoPanelSettings);
