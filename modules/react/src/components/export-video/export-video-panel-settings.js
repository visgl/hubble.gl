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

import React, {useState} from 'react';
import styled, {withTheme} from 'styled-components';

import {DEFAULT_ROW_GAP, DEFAULT_FILENAME, FORMATS, RESOLUTIONS} from './constants';

import {msConversion, estimateFileSize} from './utils';

import {WithKeplerUI} from '../inject-kepler';

import EditTab from './modal-tab-edit';
import ExportTab from './modal-tab-export';
import get from 'lodash.get';

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

function ExportVideoPanelSettings({
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
}) {
  const loadingMethods = [
    {
      id: 'export-modal-tab-edit',
      label: 'Edit', // TODO this gives localization error. Previously modal.loadData.upload which can be found in src/localization in kepler https://github.com/keplergl/kepler.gl/tree/9e5bfdca2951d21be21d180ee162646caac86d50/src/localization
      elementType: EditTab
    },
    {
      id: 'export-modal-tab-export',
      label: 'Export', // TODO this gives localization error. Previously modal.loadData.upload which can be found in src/localization in kepler https://github.com/keplergl/kepler.gl/tree/9e5bfdca2951d21be21d180ee162646caac86d50/src/localization
      elementType: ExportTab
    }
  ];
  const getDefaultMethod = methods => (Array.isArray(methods) ? get(methods, [0]) : null);
  const [currentMethod, toggleMethod] = useState(getDefaultMethod(loadingMethods));
  const ElementType = currentMethod.elementType;
  return (
    <WithKeplerUI>
      {({Input, ItemSelector, Slider, ModalTabsFactory}) => {
        const ModalTabs = ModalTabsFactory();
        return (
          // TODO 2 returns. This return sholdn't be here
          <div>
            <ModalTabs
              currentMethod={currentMethod.id}
              loadingMethods={loadingMethods}
              toggleMethod={toggleMethod}
            />
            {currentMethod && (
              <ElementType
                InputGrid={InputGrid}
                StyledLabelCell={StyledLabelCell}
                Input={Input}
                settingsData={settingsData}
                DEFAULT_FILENAME={DEFAULT_FILENAME}
                setFileName={setFileName}
                ItemSelector={ItemSelector}
                getSelectedItems={getSelectedItems}
                FORMATS={FORMATS}
                getOptionValue={getOptionValue}
                displayOption={displayOption}
                setMediaType={setMediaType}
                RESOLUTIONS={RESOLUTIONS}
                setResolution={setResolution}
                StyledValueCell={StyledValueCell}
                SliderWrapper={SliderWrapper}
                Slider={Slider}
                durationMs={durationMs}
                setDuration={setDuration}
                msConversion={msConversion}
                estimateFileSize={estimateFileSize}
                frameRate={frameRate}
                resolution={resolution}
                mediaType={mediaType}
                setCameraPreset={setCameraPreset}
              />
            )}
          </div>
        );
      }}
    </WithKeplerUI>
  );
}

export default withTheme(ExportVideoPanelSettings);
