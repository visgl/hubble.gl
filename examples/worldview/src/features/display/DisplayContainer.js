// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useMemo, useCallback, useEffect} from 'react';
import {DeckAdapter, DeckScene} from '@hubble.gl/core';

import {Display} from './Display';
import {useDispatch, useSelector} from 'react-redux';

import {setupRenderer, dimensionSelector, durationSelector} from '../renderer';

import {updateViewState, viewStateSelector} from './displaySlice';

export const DisplayContainer = ({
  width = 540,
  height,
  deckProps,
  staticMapProps,
  prepareFrame,
  glContext
}) => {
  const dispatch = useDispatch();
  const dimension = useSelector(dimensionSelector);
  const viewState = useSelector(viewStateSelector);
  const duration = useSelector(durationSelector);

  const getDeckScene = useCallback(
    animationLoop => {
      return new DeckScene({
        animationLoop,
        lengthMs: duration,
        width: dimension.width,
        height: dimension.height
      });
    },
    [duration, dimension]
  );

  const adapter = useMemo(() => new DeckAdapter(getDeckScene, glContext), [
    getDeckScene,
    glContext
  ]);

  useEffect(() => {
    dispatch(setupRenderer(adapter));
  }, [adapter]);

  return (
    <Display
      deckProps={deckProps}
      staticMapProps={staticMapProps}
      // UI Props
      width={width}
      height={height}
      // Map Props
      viewState={viewState}
      setViewState={vs => dispatch(updateViewState(vs))}
      // Hubble Props
      adapter={adapter}
      dimension={dimension}
      prepareFrame={prepareFrame}
    />
  );
};
