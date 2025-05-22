// hubble.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {useState, useCallback, useMemo, RefObject} from 'react';
import {DeckAdapter, DeckAnimation, DeckAnimationConstructor} from '@hubble.gl/core';
import type {Layer, MapViewState, Deck} from '@deck.gl/core';
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
  }, [deckAnimation]);
  return {adapter, layers, cameraFrame, setCameraFrame};
}

export function useDeckAnimation(params: DeckAnimationConstructor) {
  return useMemo(() => new DeckAnimation(params), [params]);
}

export function useHubbleGl<ReactMapRef extends MapRef>({
  deckRef,
  mapRef = undefined,
  deckAnimation,
  initialViewState = undefined
}: {
  deckRef: RefObject<Deck>;
  mapRef?: RefObject<ReactMapRef>;
  deckAnimation: DeckAnimation;
  initialViewState?: MapViewState;
}) {
  const deck = useMemo(() => deckRef.current, [deckRef.current]);
  const nextFrame = useNextFrame();
  const {adapter, layers, cameraFrame, setCameraFrame} = useDeckAdapter(
    deckAnimation,
    initialViewState
  );

  const mapProps = useMemo(() => {
    if (!mapRef) return {};
    return {
      onLoad: () => {
        if (mapRef.current) {
          const map = mapRef.current.getMap();
          map.on('render', () => adapter.onAfterRender(nextFrame, map.areTilesLoaded()));
        }
      },
      preventStyleDiffing: true
    };
  }, [mapRef, adapter, nextFrame]);

  const deckProps = useMemo(() => {
    if (!deck) return {};
    return adapter.getProps({
      deck,
      onNextFrame: mapRef ? undefined : nextFrame,
      extraProps: {layers}
    });
  }, [deck, adapter, layers, mapRef, nextFrame]);

  return {
    adapter,
    cameraFrame,
    setCameraFrame,
    mapProps,
    deckProps
  };
}
