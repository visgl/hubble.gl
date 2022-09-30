import React from 'react';
import {Pillarbox} from './pillarbox';
import {scale} from './utils';

// Render similar viewport boundary regardless of internal canvas size.
// The viewport bounds change with canvas size, so constrain it around
// a square (default 1080px). It can be wide, tall, or square.
const getCanvasClientSize = (internalCanvasResolution, minAxis = 1080) => {
  const aspect = internalCanvasResolution.width / internalCanvasResolution.height;
  if (aspect > 1) {
    // horizontal
    return {width: Math.round(minAxis * aspect), height: minAxis};
  } else if (aspect < 1) {
    // vertical
    return {width: minAxis, height: Math.round(minAxis / aspect)};
  }
  // square
  return {width: minAxis, height: minAxis};
};

export const DeckGLRender = ({renderResolution, previewPadding = 0, overlay = null, children}) => {
  const canvasClientSize = getCanvasClientSize(renderResolution);
  return (
    <Pillarbox
      internalCanvasResolution={renderResolution}
      previewPadding={previewPadding}
      overlay={overlay}
    >
      {previewSize => {
        const scalar = scale(previewSize, canvasClientSize);
        const deckglStyle = {
          width: `${canvasClientSize.width}px`,
          height: `${canvasClientSize.height}px`,
          transform: `scale(${scalar})`,
          transformOrigin: 'top left'
        };
        return (
          <div
            id="map-render"
            style={{
              width: `${previewSize.width}px`,
              height: `${previewSize.height}px`,
              position: 'relative'
            }}
          >
            {children(deckglStyle)}
          </div>
        );
      }}
    </Pillarbox>
  );
};
