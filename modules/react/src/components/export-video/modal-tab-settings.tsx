// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
import React, {ChangeEvent, useState} from 'react';

import {estimateFileSize} from './utils';
import {StyledLabelCell, StyledValueCell, InputGrid} from './styled-components';
import {FORMATS, RESOLUTIONS, ASPECT_RATIOS, DEFAULT_PREVIEW_RESOLUTIONS} from './constants';
import {WithKeplerUI} from '../inject-kepler';
import type {ExportVideoSettings} from './export-video-panel-settings';

const getOptionValue = (r: {value: string}) => r.value;
const displayOption = (r: {label: string}) => r.label;
const getSelectedItems = (options: {value: string}[], value: string) =>
  options.find(o => o.value === value);

function SettingsTab({
  settings,
  resolution,
  disabled
}: {
  settings: ExportVideoSettings;
  resolution: [number, number];
  disabled: boolean;
}) {
  const [aspRatio, setAspRatio] = useState(ASPECT_RATIOS['16_9']);
  return (
    <WithKeplerUI>
      {({Input, ItemSelector}) => (
        <>
          <InputGrid $rows={5}>
            <StyledLabelCell>File Name</StyledLabelCell>
            <Input
              value={settings.fileName}
              placeholder={settings.fileNamePlaceholder}
              onChange={(e: ChangeEvent<HTMLInputElement>) => settings.setFileName(e.target.value)}
              disabled={disabled}
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
              disabled={disabled}
            />
            <StyledLabelCell>Ratio</StyledLabelCell>
            <ItemSelector
              selectedItems={aspRatio}
              options={[ASPECT_RATIOS['4_3'], ASPECT_RATIOS['16_9']]}
              multiSelect={false}
              searchable={false}
              onChange={ratio => {
                setAspRatio(ratio);
                settings.setResolution(DEFAULT_PREVIEW_RESOLUTIONS[ratio]);
              }}
              disabled={disabled}
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
              disabled={disabled}
            />
            <StyledLabelCell>File Size</StyledLabelCell>
            <StyledValueCell>
              Approx.{' '}
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

export default SettingsTab;
