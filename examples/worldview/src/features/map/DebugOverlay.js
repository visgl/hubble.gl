import React from 'react';

export function DebugOverlay({containerRef, deckRef, dimension, previewSize, dpi, onDpiChange}) {
  const container = containerRef.current;
  const deck = deckRef.current;
  const canvas = deck && deck._canvasRef.current;
  const canvasRect = canvas && canvas.getBoundingClientRect();
  const gl = deck && deck.deck.animationLoop && deck.deck.animationLoop.gl;

  return (
    <div style={{position: 'absolute', top: 0, left: 0, color: 'white'}}>
      <div>
        Expected Export size: <b>{dimension.width}</b>px x <b>{dimension.height}</b>px
      </div>
      <div>
        Expected Container size: <b>{previewSize.width}</b>px x <b>{previewSize.height}</b>px
      </div>
      {container && (
        <div>
          Container CSS client size: <b>{container.clientWidth}</b>px x{' '}
          <b>{container.clientHeight}</b>px
        </div>
      )}
      {canvasRect && (
        <div>
          Canvas BoundingClientRect size: <b>{canvasRect.width}</b>px x <b>{canvasRect.height}</b>px
        </div>
      )}
      {canvas && (
        <div>
          Canvas CSS size: <b>{canvas.clientWidth}</b>px x <b>{canvas.clientHeight}</b>px
        </div>
      )}
      {canvas && (
        <div>
          Canvas internal size: <b>{canvas.width}</b>px x <b>{canvas.height}</b>px
        </div>
      )}
      {gl && (
        <div>
          GL draw buffer size: <b>{gl.drawingBufferWidth}</b>px x <b>{gl.drawingBufferHeight}</b>px
        </div>
      )}
      <div>
        pixel ratio: <b>{window.devicePixelRatio}</b>
      </div>
      {canvas && (
        <div>
          luma size pre-flooring: <b>{window.devicePixelRatio * canvas.clientWidth}</b>px x{' '}
          <b>{window.devicePixelRatio * canvas.clientHeight}</b>px
        </div>
      )}
      <div>
        <input
          type="range"
          min={0.01}
          max={10.0}
          step={0.01}
          value={dpi}
          onChange={e => onDpiChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
