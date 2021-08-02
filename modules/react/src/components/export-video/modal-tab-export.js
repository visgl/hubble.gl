import React, {useState} from 'react';

import {estimateFileSize} from './utils';
import {StyledLabelCell, StyledValueCell, InputGrid} from './styled-components';
import {DEFAULT_FILENAME, FORMATS, RESOLUTIONS} from './constants';
import {WithKeplerUI} from '../inject-kepler';

const getOptionValue = r => r.value;
const displayOption = r => r.label;
const getSelectedItems = (options, value) => options.find(o => o.value === value);

function ExportTab({settings, resolution}) {
  const [aspRatio, setAspRatio] = useState('16:9');
  return (
    <WithKeplerUI>
      {({Input, ItemSelector}) => (
        <>
          <InputGrid rows={5}>
            <StyledLabelCell>File Name</StyledLabelCell>
            <Input
              value={settings.fileName}
              placeholder={DEFAULT_FILENAME}
              onChange={e => settings.setFileName(e.target.value)}
            />
            <StyledLabelCell>Media Type</StyledLabelCell>
            <ItemSelector
              selectedItems={getSelectedItems(FORMATS, settings.mediaType)}
              options={FORMATS}
              getOptionValue={getOptionValue}
              displayOption={displayOption}
              multiSelect={false}
              searchable={false}
              onChange={settings.setMediaType}
            />
            <StyledLabelCell>Ratio</StyledLabelCell>
            <ItemSelector
              selectedItems={aspRatio}
              options={['4:3', '16:9']}
              multiSelect={false}
              searchable={false}
              onChange={ratio => {
                setAspRatio(ratio);
                if (aspRatio === '4:3') {
                  settings.resolution = '1280x720';
                } else {
                  settings.resolution = '1280x960';
                }
                settings.setResolution(settings.resolution);
              }}
            />
            <StyledLabelCell>Quality</StyledLabelCell>
            <ItemSelector
              selectedItems={getSelectedItems(RESOLUTIONS, settings.resolution)}
              options={RESOLUTIONS.filter(o => o.aspectRatio === aspRatio)}
              getOptionValue={getOptionValue}
              displayOption={displayOption}
              multiSelect={false}
              searchable={false}
              onChange={settings.setResolution}
            />
            <StyledLabelCell>File Size</StyledLabelCell>
            <StyledValueCell>
              ~
              {estimateFileSize(
                settings.frameRate,
                resolution,
                settings.durationMs,
                settings.mediaType
              )}
            </StyledValueCell>
          </InputGrid>
        </>
      )}
    </WithKeplerUI>
  );
}

export default ExportTab;
