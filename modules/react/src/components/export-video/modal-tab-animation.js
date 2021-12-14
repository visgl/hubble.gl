import React from 'react';

import {msConversion} from './utils';
import {
  SliderWrapper,
  StyledLabelCell,
  StyledValueCell,
  InputGrid,
  VideoLengthDisplay
} from './styled-components';
import {WithKeplerUI} from '../inject-kepler';

function AnimationTab({settings, disabled}) {
  return (
    <WithKeplerUI>
      {({Slider, ItemSelector}) => (
        <>
          <InputGrid rows={5}>
            <StyledLabelCell>Duration</StyledLabelCell>
            <StyledValueCell style={{paddingLeft: '0px', paddingRight: '0px'}}>
              <SliderWrapper
                style={{width: '100%', marginLeft: '0px'}}
                className="modal-duration__slider"
              >
                <Slider
                  showValues={false}
                  enableBarDrag={!disabled}
                  isRanged={false}
                  value0={100}
                  value1={settings.durationMs}
                  step={100}
                  minValue={100}
                  maxValue={10000}
                  style={{width: '70px'}}
                  onSlider1Change={val => {
                    settings.setDuration(val);
                  }}
                />
                <VideoLengthDisplay>{msConversion(settings.durationMs)}</VideoLengthDisplay>
              </SliderWrapper>
            </StyledValueCell>
            <StyledLabelCell>Camera</StyledLabelCell>
            <ItemSelector
              selectedItems={settings.cameraPreset}
              options={[
                'None',
                'Orbit (90º)',
                'Orbit (180º)',
                'Orbit (360º)',
                'Zoom Out',
                'Zoom In'
              ]}
              multiSelect={false}
              searchable={false}
              onChange={settings.setCameraPreset}
              disabled={disabled}
            />
          </InputGrid>
        </>
      )}
    </WithKeplerUI>
  );
}

export default AnimationTab;
