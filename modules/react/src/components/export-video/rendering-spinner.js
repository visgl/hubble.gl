import {WithKeplerUI} from '../inject-kepler';
import React from 'react';

export function RenderingSpinner(props) {
  return (
    <WithKeplerUI>
      {({LoadingSpinner}) => (
        <div className="loader" style={props.loaderStyle}>
          <LoadingSpinner />
          {/* TODO change text styling to match Kepler's */}
          <div
            className="rendering-percent"
            style={{color: 'white', position: 'absolute', top: '175px'}}
          >
            {/* TODO make conditional 100% and fix video-capture */}
            {Math.floor((props.adapter.videoCapture.timeMs / props.durationMs) * 100).toFixed(0)} %
            {/* TODO conditional "Saving..." message after rendering done */}
            {/* TODO conditional "Saving...Hang Tight" message after 10s */}
          </div>
        </div>
      )}
    </WithKeplerUI>
  );
}
