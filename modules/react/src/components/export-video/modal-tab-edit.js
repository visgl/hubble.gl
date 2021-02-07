import React from 'react';

function EditTab({
  InputGrid,
  StyledLabelCell,
  Input,
  settingsData,
  DEFAULT_FILENAME,
  setFileName,
  ItemSelector,
  getSelectedItems,
  FORMATS,
  getOptionValue,
  displayOption,
  setMediaType,
  RESOLUTIONS,
  setResolution,
  StyledValueCell,
  SliderWrapper,
  Slider,
  durationMs,
  setDuration,
  msConversion,
  estimateFileSize,
  frameRate,
  resolution,
  mediaType,
  setCameraPreset
}) {
  return (
    <div>
      <InputGrid rows={5}>
        <StyledLabelCell>Ratio</StyledLabelCell> {/* TODO */}
        <ItemSelector
          disabled={true}
          selectedItems={'16:9'}
          options={['4:3', '16:9']}
          multiSelect={false}
          searchable={false}
          onChange={() => {}}
        />
        <StyledLabelCell>Speed</StyledLabelCell> {/* TODO */}
        <ItemSelector
          disabled={true}
          selectedItems={'Normal'}
          options={['4:3', '16:9']}
          multiSelect={false}
          searchable={false}
          onChange={() => {}}
        />
        <StyledLabelCell>Duration</StyledLabelCell>
        <StyledValueCell style={{paddingLeft: '0px', paddingRight: '0px'}}>
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
      </InputGrid>
    </div>
  );
}

export default EditTab;
