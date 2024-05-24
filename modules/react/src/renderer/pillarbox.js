import React, {useCallback} from 'react';
import styled from 'styled-components';
import AutoSizer from 'react-virtualized-auto-sizer';
import {nearestEven, scale} from './utils';

const AutoSizePillarbox = ({children, internalCanvasResolution, previewPadding}) => {
  const getPreviewSize = useCallback(
    ({width, height}) => {
      // padding
      if (width > height) {
        width = width - previewPadding;
      } else {
        height = height - previewPadding;
      }
      const scalar = scale({width, height}, internalCanvasResolution);
      return {
        width: nearestEven(internalCanvasResolution.width * scalar, 0),
        height: nearestEven(internalCanvasResolution.height * scalar, 0)
      };
    },
    [internalCanvasResolution, previewPadding]
  );

  return (
    <AutoSizer>
      {({width, height}) => {
        const previewSize = getPreviewSize({width, height});
        return children({
          previewSize,
          pillarboxSize: {width: nearestEven(width, 0), height: nearestEven(height, 0)}
        });
      }}
    </AutoSizer>
  );
};

const PillarboxBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.size.width}px;
  height: ${props => props.size.height}px;
`;

const PillarboxOverlay = styled.div`
  position: absolute;
  width: ${props => props.size.width}px;
  height: ${props => props.size.height}px;
`;

export const Pillarbox = ({children, overlay, internalCanvasResolution, previewPadding}) => {
  return (
    <AutoSizePillarbox
      internalCanvasResolution={internalCanvasResolution}
      previewPadding={previewPadding}
    >
      {({previewSize, pillarboxSize}) => (
        <PillarboxBackground size={pillarboxSize}>
          {children ? (
            children(previewSize)
          ) : (
            <div
              style={{
                width: previewSize.width,
                height: previewSize.height,
                backgroundColor: 'green'
              }}
            />
          )}
          {overlay && <PillarboxOverlay size={pillarboxSize}>{overlay}</PillarboxOverlay>}
        </PillarboxBackground>
      )}
    </AutoSizePillarbox>
  );
};
