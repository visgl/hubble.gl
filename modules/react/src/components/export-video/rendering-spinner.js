import {WithKeplerUI} from '../inject-kepler';
import React from 'react';

// /**
//  * TODO
//  * @param {boolean} rendering
//  * @param {string} exportVideoWidth
//  * @param {string} _getContainerHeight
//  * @param {string} adapter
//  * @param {Object} durationMs
//  * @returns {Object}
//  */
export function RenderingSpinner({
  rendering,
  exportVideoWidth,
  _getContainerHeight,
  adapter,
  durationMs
}) {
  const startTimer = Date.now();
  const percentRendered = Math.floor((adapter.videoCapture.timeMs / durationMs) * 100).toFixed(0);
  const showRenderingPercent = adapter.videoCapture._getNextTimeMs() < durationMs;
  const showSaving = adapter.videoCapture._getNextTimeMs() > durationMs;

  const loaderStyle = {
    display: rendering === false ? 'none' : 'flex',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    width: `${exportVideoWidth}px`,
    height: `${_getContainerHeight}px`,
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <WithKeplerUI>
      {({LoadingSpinner}) => (
        <div className="loader" style={loaderStyle}>
          <LoadingSpinner />
          {/* TODO change text styling to match Kepler's */}
          <div
            className="rendering-feedback-container"
            style={{color: 'white', position: 'absolute', top: '175px'}}
          >
            {showRenderingPercent && <div className="rendering-percent">{percentRendered} %</div>}
            {showSaving && <div className="saving-message">Saving...</div>}
            <div
              className="saving-message-delayed"
              style={{
                display:
                  Date.now() - startTimer > 10000 + adapter.videoCapture.timeMs ? 'flex' : 'none'
              }}
            >
              {' '}
              {/* TODO Doesn't show up. Look at usememo for value of startTimer. setTimeout? useEffect hook to run once. Ultimately want a boolean */}
              {/* Appears after "Saving..." message has been showing for at least 10s */}
              Saving...Hang Tight.
            </div>
          </div>
        </div>
      )}
    </WithKeplerUI>
  );
}
