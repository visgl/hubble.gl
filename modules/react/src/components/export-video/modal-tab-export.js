import React from 'react';

import {estimateFileSize} from './utils';
import {StyledLabelCell, StyledValueCell, InputGrid} from './styled-components';
import {DEFAULT_FILENAME, FORMATS, RESOLUTIONS} from './constants';
import {WithKeplerUI} from '../inject-kepler';

function ExportTab({
  settingsData,
  setFileName,
  getSelectedItems,
  getOptionValue,
  displayOption,
  setMediaType,
  setResolution,
  durationMs,
  frameRate,
  resolution,
  mediaType
}) {
  return (
    <WithKeplerUI>
      {({Input, ItemSelector}) => (
        <>
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
            <StyledLabelCell>File Size</StyledLabelCell>
            <StyledValueCell>
              ~{estimateFileSize(frameRate, resolution, durationMs, mediaType)}
            </StyledValueCell>
          </InputGrid>
        </>
      )}
    </WithKeplerUI>
  );
}

export default ExportTab;
