// Copyright (c) 2021 Uber Technologies, Inc.
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

import {useState, useCallback, useMemo} from 'react';
import {DeckAnimator, DeckAnimation} from '@hubble.gl/core';
import {MapboxLayer} from '@deck.gl/mapbox';

export function useNextFrame() {
  const [, updateState] = useState();
  return useCallback(() => updateState({}), []);
}

export function useDeckAnimator(deckAnimation, initialViewState = undefined) {
  const [layers, setLayers] = useState([]);
  const [cameraFrame, setCameraFrame] = useState(initialViewState);
  const adapter = useMemo(() => {
    const a = new DeckAnimator({});
    deckAnimation.setOnLayersUpdate(setLayers);
    if (initialViewState) {
      deckAnimation.setOnCameraUpdate(setCameraFrame);
    }
    a.animationManager.attachAnimation(deckAnimation);
    deckAnimation.draw();
    return a;
  }, []);
  return {adapter, layers, cameraFrame, setCameraFrame};
}

export function useDeckAnimation(params) {
  return useMemo(() => new DeckAnimation(params), []);
}

export function useHubbleGl({
  deckRef,
  staticMapRef = undefined,
  deckAnimation,
  initialViewState = undefined
}) {
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const nextFrame = useNextFrame();
  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAnimator(
    deckAnimation,
    initialViewState
  );

  const onStaticMapLoad = useCallback(() => {
    if (staticMapRef) {
      const map = staticMapRef.current.getMap();
      // If there aren't any layers, combine map and deck with a fake layer.
      if (!layers.length) {
        map.addLayer(new MapboxLayer({id: '%%blank-layer', deck}));
      }
      for (let i = 0; i < layers.length; i++) {
        // Adds DeckGL layers to Mapbox so Mapbox can be the bottom layer. Removing this clips DeckGL layers
        map.addLayer(new MapboxLayer({id: layers[i].id, deck}));
      }
      map.on('render', () => adapter.onAfterRender(nextFrame, map.areTilesLoaded()));
    }
  }, [deck]);

  const [glContext, setGLContext] = useState();

  if (!staticMapRef) {
    return {
      adapter,
      cameraFrame,
      setCameraFrame,
      staticMapProps: {},
      deckProps: adapter.getProps({
        deck,
        onNextFrame: nextFrame,
        extraProps: {
          layers
        }
      })
    };
  }

  return {
    adapter,
    cameraFrame,
    setCameraFrame,
    onStaticMapLoad,
    staticMapProps: {
      gl: glContext,
      onLoad: onStaticMapLoad,
      preventStyleDiffing: true
    },
    deckProps: adapter.getProps({
      deck,
      extraProps: {
        onWebGLInitialized: setGLContext,
        layers
      }
    })
  };
}
