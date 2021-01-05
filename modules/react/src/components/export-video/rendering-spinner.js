import {WithKeplerUI} from '../inject-kepler';
import React from 'react';

export function RenderingSpinner({
  rendering,
  exportVideoWidth,
  _getContainerHeight,
  adapter,
  durationMs
}) {
  const startTimer = Date.now();

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
            className="rendering-percent"
            style={{color: 'white', position: 'absolute', top: '175px'}}
          >
            <div
              className="rendering-percent"
              style={{
                display: adapter.videoCapture._getNextTimeMs() < durationMs ? 'flex' : 'none'
              }}
            >
              {Math.floor((adapter.videoCapture.timeMs / durationMs) * 100).toFixed(0)} %
            </div>
            <div
              className="saving-message"
              style={{
                display: adapter.videoCapture._getNextTimeMs() < durationMs ? 'none' : 'flex'
              }}
            >
              Saving...
            </div>
            {/* TODO look at usememo for value of startTimer. setTimeout? useEffect hook to run once. Ultimately want a boolean */}
            <div
              className="saving-message-delayed"
              style={{
                display:
                  Date.now() - startTimer > 10000 + adapter.videoCapture.timeMs ? 'flex' : 'none'
              }}
            >
              {/* Appears after "Saving..." message has been showing for at least 10s */}
              Saving...Hang Tight.
            </div>
          </div>
        </div>
      )}
    </WithKeplerUI>
  );
}
