import React, {useCallback} from 'react';
import styled from 'styled-components';
import {AutoSizer} from 'react-virtualized';
import {nearestEven, scale} from '../../utils';

const AutoSizePillarbox = ({children, resolution}) => {
  const getPreviewSize = useCallback(
    ({width, height}) => {
      const scalar = scale({width, height}, resolution);
      return {
        width: nearestEven(resolution.width * scalar, 0),
        height: nearestEven(resolution.height * scalar, 0)
      };
    },
    [resolution]
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

const PillarboxOverlay = ({children, size}) => {
  const overlayStyle = {
    display: 'flex',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    width: `${size.width}px`,
    height: `${size.height}px`,
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className="overlay" style={overlayStyle}>
      {children}
    </div>
  );
};

export const Pillarbox = ({children, overlay, resolution}) => {
  return (
    <AutoSizePillarbox resolution={resolution}>
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
