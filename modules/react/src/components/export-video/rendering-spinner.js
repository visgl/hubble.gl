import {WithKeplerUI} from '../inject-kepler';
import React, {useEffect, useState} from 'react';

/**
 * @typedef {Object} RenderingSpinnerProps
 * @property {boolean} rendering whether a video is currently rendering or not
 * @property {number} width width of container
 * @property {number} height height of container
 * @property {Object} adapter Hubble Deck adapter
 * @property {number} durationMs duration of animation set by user
 */

/**
 * @param {RenderingSpinnerProps} props
 * @returns {Object} React Component that gives user feedback after they click the "Render" button
 */
export function RenderingSpinner({rendering, width, height, adapter, durationMs}) {
  const percentRendered = Math.floor((adapter.videoCapture.timeMs / durationMs) * 100).toFixed(0);
  const showRenderingPercent = adapter.videoCapture._getNextTimeMs() < durationMs;
  const showSaving = adapter.videoCapture._getNextTimeMs() > durationMs;

  const [message, setMessage] = useState('Saving...');
  useEffect(() => {
    let waitTimeout;
    if (showSaving) {
      // Appears after "Saving..." message has been showing for at least 2s
      waitTimeout = setTimeout(() => setMessage('Saving...Hang Tight.'), 2000);
    } else {
      setMessage('Saving...');
      if (waitTimeout) clearTimeout(waitTimeout);
    }

    return () => {
      if (waitTimeout) clearTimeout(waitTimeout);
    };
  }, [showSaving]);

  const loaderStyle = {
    display: rendering === false ? 'none' : 'flex',
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.5)',
    width: `${width}px`,
    height: `${height}px`,
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
            {showSaving && <div className="saving-message">{message}</div>}
          </div>
        </div>
      )}
    </WithKeplerUI>
  );
}
