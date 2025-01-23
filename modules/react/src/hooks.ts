// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {useState, useCallback, useMemo, RefObject} from 'react';
import {DeckAdapter, DeckAnimation, DeckAnimationConstructor} from '@hubble.gl/core';
import {MapboxLayer} from '@deck.gl/mapbox/typed';
import type {Layer, MapViewState} from '@deck.gl/core/typed';
import type {DeckGLRef} from '@deck.gl/react/typed';
import type {MapRef} from 'react-map-gl';

export function useNextFrame() {
  const [, updateState] = useState({});
  return useCallback(() => updateState({}), []);
}

export function useDeckAdapter(
  deckAnimation: DeckAnimation,
  initialViewState: MapViewState = undefined
) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [cameraFrame, setCameraFrame] = useState<MapViewState>(initialViewState);
  const adapter = useMemo(() => {
    const a = new DeckAdapter({});
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

export function useDeckAnimation(params: DeckAnimationConstructor) {
  return useMemo(() => new DeckAnimation(params), []);
}

export function useHubbleGl({
  deckRef,
  staticMapRef = undefined,
  deckAnimation,
  initialViewState = undefined
}: {
  deckRef: RefObject<DeckGLRef>;
  staticMapRef?: RefObject<MapRef>;
  deckAnimation: DeckAnimation;
  initialViewState?: MapViewState;
}) {
  const deck = useMemo(() => deckRef.current && deckRef.current.deck, [deckRef.current]);
  const nextFrame = useNextFrame();
  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(
    deckAnimation,
    initialViewState
  );

  const onStaticMapLoad = useCallback(() => {
    if (staticMapRef) {
      const map = staticMapRef.current.getMap();
      // If there aren't any layers, combine map and deck with a fake layer.
      if (!layers.length) {
        // @ts-expect-error maplibre and mapbox have different types
        map.addLayer(new MapboxLayer({id: '%%blank-layer', deck}));
      }
      for (let i = 0; i < layers.length; i++) {
        // Adds DeckGL layers to Mapbox so Mapbox can be the bottom layer. Removing this clips DeckGL layers
        // @ts-expect-error maplibre and mapbox have different types
        map.addLayer(new MapboxLayer({id: layers[i].id, deck}));
      }
      map.on('render', () => adapter.onAfterRender(nextFrame, map.areTilesLoaded()));
    }
  }, [deck]);

  const [glContext, setGLContext] = useState<WebGLRenderingContext>();

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
