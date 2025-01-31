// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {useState, useCallback, useMemo, RefObject} from 'react';
import {DeckAdapter, DeckAnimation, DeckAnimationConstructor} from '@hubble.gl/core';
import type {Layer, MapViewState, Deck} from '@deck.gl/core/typed';
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
  mapRef = undefined,
  deckAnimation,
  initialViewState = undefined
}: {
  deckRef: RefObject<Deck>;
  mapRef?: RefObject<MapRef>;
  deckAnimation: DeckAnimation;
  initialViewState?: MapViewState;
}) {
  const deck = useMemo(() => deckRef.current, [deckRef.current]);
  const nextFrame = useNextFrame();
  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(
    deckAnimation,
    initialViewState
  );

  const onMapLoad = useCallback(() => {
    if (mapRef) {
      const map = mapRef.current.getMap();
      map.on('render', () => adapter.onAfterRender(nextFrame, map.areTilesLoaded()));
    }
  }, [adapter, nextFrame]);

  if (!mapRef) {
    return {
      adapter,
      cameraFrame,
      setCameraFrame,
      mapProps: {},
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
    onMapLoad,
    mapProps: {
      onLoad: onMapLoad,
      preventStyleDiffing: true
    },
    deckProps: adapter.getProps({
      deck,
      extraProps: {
        layers
      }
    })
  };
}
