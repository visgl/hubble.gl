// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors
/* global window */
import {WithKeplerUI} from '../inject-kepler';
import React, {useEffect, useState} from 'react';

import {LoaderWrapper, RenderingFeedbackContainer} from './styled-components';
import { DeckAdapter } from '@hubble.gl/core';

type RenderingSpinnerProps = {
  rendering: boolean // whether a video is currently rendering or not
  saving: boolean // whether a video is currently saving or not
  width: number // width of container
  height: number // height of container
  adapter: DeckAdapter // Hubble Deck adapter
  durationMs: number // duration of animation set by user
}

/**
 * @param props
 * @returns React Component that gives user feedback after they click the "Render" button
 */
export function RenderingSpinner({rendering, saving, width, height, adapter, durationMs}: RenderingSpinnerProps) {
  const percentRendered = Math.floor((adapter.videoCapture.timeMs / durationMs) * 100).toFixed(0);
  const showRenderingPercent = adapter.videoCapture.timeMs < durationMs && adapter.enabled;

  const [message, setMessage] = useState('Saving...');
  useEffect(() => {
    let waitTimeout: number;
    if (saving) {
      // Appears after "Saving..." message has been showing for at least 2s
      waitTimeout = window.setTimeout(() => setMessage('Saving...Hang Tight.'), 2000);
    } else {
      setMessage('Saving...');
      if (waitTimeout) window.clearTimeout(waitTimeout);
    }

    return () => {
      if (waitTimeout) window.clearTimeout(waitTimeout);
    };
  }, [saving]);

  return (
    <WithKeplerUI>
      {({LoadingSpinner}) => (
        <LoaderWrapper
          className="loader-wrapper"
          width={width}
          height={height}
          rendering={rendering}
        >
          <LoadingSpinner />
          <RenderingFeedbackContainer className="rendering-feedback-container" height={height}>
            {showRenderingPercent && <div className="rendering-percent">{percentRendered} %</div>}
            {saving && <div className="saving-message">{message}</div>}
          </RenderingFeedbackContainer>
        </LoaderWrapper>
      )}
    </WithKeplerUI>
  );
}
